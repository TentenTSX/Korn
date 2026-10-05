import argon2 from "argon2";
import authActions from "../src/modules/auth/authActions";
import authRepository from "../src/modules/auth/authRepository";
import googleClient from "../src/modules/auth/googleClient";
import * as emailService from "../src/modules/email/emailService";

process.env.JWT_SECRET = "test-jwt-secret";

function buildUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id_user: 1,
    first_name: "Ada",
    last_name: "Lovelace",
    email: "ada@example.com",
    password_hash: "hashed",
    google_id: null,
    ...overrides,
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("authActions.register", () => {
  test("creates a new user and returns a token for valid input", async () => {
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(undefined);
    jest
      .spyOn(authRepository, "create")
      .mockResolvedValue(buildUser({ id_user: 42 }));

    const result = await authActions.register({
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ADA@Example.com ",
      password: "supersecret",
    });

    expect(result.user).toEqual({
      id_user: 42,
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
    });
    expect(typeof result.token).toBe("string");
    expect(authRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ada@example.com" }),
    );
  });

  test("rejects a password shorter than 8 characters", async () => {
    await expect(
      authActions.register({
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
        password: "short",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects an invalid email address", async () => {
    await expect(
      authActions.register({
        first_name: "Ada",
        last_name: "Lovelace",
        email: "not-an-email",
        password: "supersecret",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects registration when the email is already used", async () => {
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(buildUser());

    await expect(
      authActions.register({
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
        password: "supersecret",
      }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });
});

describe("authActions.login", () => {
  test("logs in with correct credentials", async () => {
    const passwordHash = await argon2.hash("correct-password");
    jest
      .spyOn(authRepository, "findByEmail")
      .mockResolvedValue(buildUser({ password_hash: passwordHash }));

    const result = await authActions.login({
      email: "ada@example.com",
      password: "correct-password",
    });

    expect(result.user.email).toBe("ada@example.com");
    expect(typeof result.token).toBe("string");
  });

  test("rejects when the email is missing", async () => {
    await expect(
      authActions.login({ email: "", password: "correct-password" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects an unknown email", async () => {
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(undefined);

    await expect(
      authActions.login({ email: "ghost@example.com", password: "whatever" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  test("rejects an incorrect password", async () => {
    const passwordHash = await argon2.hash("correct-password");
    jest
      .spyOn(authRepository, "findByEmail")
      .mockResolvedValue(buildUser({ password_hash: passwordHash }));

    await expect(
      authActions.login({
        email: "ada@example.com",
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("authActions.getCurrentUser", () => {
  test("returns the user when found", async () => {
    jest.spyOn(authRepository, "findById").mockResolvedValue(buildUser());
    const user = await authActions.getCurrentUser(1);
    expect(user.email).toBe("ada@example.com");
  });

  test("throws UNAUTHORIZED when the user no longer exists", async () => {
    jest.spyOn(authRepository, "findById").mockResolvedValue(undefined);
    await expect(authActions.getCurrentUser(999)).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("authActions.getProfile", () => {
  test("returns the profile when the requester matches", async () => {
    jest.spyOn(authRepository, "findById").mockResolvedValue(buildUser());
    const user = await authActions.getProfile(1, 1);
    expect(user.id_user).toBe(1);
  });

  test("rejects an invalid requested id", async () => {
    await expect(authActions.getProfile(1, -1)).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  test("rejects access to another user's profile", async () => {
    await expect(authActions.getProfile(1, 2)).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  test("rejects when the profile no longer exists", async () => {
    jest.spyOn(authRepository, "findById").mockResolvedValue(undefined);
    await expect(authActions.getProfile(1, 1)).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});

describe("authActions.requestPasswordReset", () => {
  test("rejects an invalid email", async () => {
    await expect(
      authActions.requestPasswordReset("not-an-email"),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("does nothing and sends no email for an unknown address", async () => {
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(undefined);
    const sendSpy = jest
      .spyOn(emailService, "sendPasswordResetEmail")
      .mockResolvedValue(undefined);

    await authActions.requestPasswordReset("ghost@example.com");

    expect(sendSpy).not.toHaveBeenCalled();
  });

  test("creates a reset token and sends an email for a known address", async () => {
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(buildUser());
    const createResetSpy = jest
      .spyOn(authRepository, "createPasswordReset")
      .mockResolvedValue(undefined);
    const sendSpy = jest
      .spyOn(emailService, "sendPasswordResetEmail")
      .mockResolvedValue(undefined);

    await authActions.requestPasswordReset("ADA@example.com");

    expect(createResetSpy).toHaveBeenCalledWith(
      1,
      expect.any(String),
      expect.any(Date),
    );
    expect(sendSpy).toHaveBeenCalledWith(
      "ada@example.com",
      expect.stringContaining("/reset-password?token="),
    );
  });
});

describe("authActions.confirmPasswordReset", () => {
  test("rejects a missing token", async () => {
    await expect(
      authActions.confirmPasswordReset("", "newpassword1"),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects a password shorter than 8 characters", async () => {
    await expect(
      authActions.confirmPasswordReset("some-token", "short"),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("rejects an expired or unknown token", async () => {
    jest
      .spyOn(authRepository, "findPasswordReset")
      .mockResolvedValue(undefined);

    await expect(
      authActions.confirmPasswordReset("bad-token", "newpassword1"),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("updates the password for a valid token", async () => {
    jest.spyOn(authRepository, "findPasswordReset").mockResolvedValue({
      user_id: 1,
      expires_at: new Date(Date.now() + 60_000),
    });
    const updateSpy = jest
      .spyOn(authRepository, "updatePassword")
      .mockResolvedValue(undefined);
    const deleteSpy = jest
      .spyOn(authRepository, "deletePasswordResetsForUser")
      .mockResolvedValue(undefined);

    await authActions.confirmPasswordReset("good-token", "newpassword1");

    expect(updateSpy).toHaveBeenCalledWith(1, expect.any(String));
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});

describe("authActions.loginWithGoogleCode", () => {
  test("logs in directly when the google_id is already linked", async () => {
    jest.spyOn(googleClient, "getProfileFromCode").mockResolvedValue({
      googleId: "google-123",
      email: "ada@example.com",
      firstName: "Ada",
      lastName: "Lovelace",
    });
    jest
      .spyOn(authRepository, "findByGoogleId")
      .mockResolvedValue(buildUser({ google_id: "google-123" }));
    const createSpy = jest.spyOn(authRepository, "create");

    const result = await authActions.loginWithGoogleCode("auth-code");

    expect(result.user.email).toBe("ada@example.com");
    expect(createSpy).not.toHaveBeenCalled();
  });

  test("links the google_id to an existing account found by email", async () => {
    jest.spyOn(googleClient, "getProfileFromCode").mockResolvedValue({
      googleId: "google-123",
      email: "ada@example.com",
      firstName: "Ada",
      lastName: "Lovelace",
    });
    jest.spyOn(authRepository, "findByGoogleId").mockResolvedValue(undefined);
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(buildUser());
    const linkSpy = jest
      .spyOn(authRepository, "linkGoogleId")
      .mockResolvedValue(undefined);

    const result = await authActions.loginWithGoogleCode("auth-code");

    expect(linkSpy).toHaveBeenCalledWith(1, "google-123");
    expect(result.user.email).toBe("ada@example.com");
  });

  test("creates a new account when no match exists", async () => {
    jest.spyOn(googleClient, "getProfileFromCode").mockResolvedValue({
      googleId: "google-456",
      email: "new@example.com",
      firstName: "New",
      lastName: "Account",
    });
    jest.spyOn(authRepository, "findByGoogleId").mockResolvedValue(undefined);
    jest.spyOn(authRepository, "findByEmail").mockResolvedValue(undefined);
    const createSpy = jest.spyOn(authRepository, "create").mockResolvedValue(
      buildUser({
        id_user: 99,
        email: "new@example.com",
        first_name: "New",
        last_name: "Account",
      }),
    );

    const result = await authActions.loginWithGoogleCode("auth-code");

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        googleId: "google-456",
      }),
    );
    expect(result.user.email).toBe("new@example.com");
  });

  test("propagates an error when the Google profile is invalid", async () => {
    jest
      .spyOn(googleClient, "getProfileFromCode")
      .mockRejectedValue(
        new Error("Profil Google invalide ou email non vérifié."),
      );

    await expect(authActions.loginWithGoogleCode("bad-code")).rejects.toThrow(
      "Profil Google invalide",
    );
  });
});
