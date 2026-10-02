import argon2 from "argon2";
import ActionError from "../ActionError";
import jwtUtil from "./Jwt";
import authRepository from "./authRepository";

type RegisterInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type LoginInput = { email: string; password: string };

function publicUser(user: {
  id_user: number;
  first_name: string;
  last_name: string;
  email: string;
}) {
  return {
    id_user: user.id_user,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
}

function validateCredentials(input: LoginInput): asserts input is LoginInput {
  if (
    typeof input?.email !== "string" ||
    !input.email.trim() ||
    typeof input.password !== "string" ||
    !input.password
  ) {
    throw new ActionError("BAD_REQUEST", "Email et mot de passe requis.");
  }
}

const register = async (input: RegisterInput) => {
  if (
    typeof input?.first_name !== "string" ||
    !input.first_name.trim() ||
    typeof input.last_name !== "string" ||
    !input.last_name.trim() ||
    typeof input.email !== "string" ||
    !input.email.trim() ||
    typeof input.password !== "string" ||
    input.password.length < 8
  ) {
    throw new ActionError(
      "BAD_REQUEST",
      "Les champs sont requis et le mot de passe doit contenir au moins 8 caractères.",
    );
  }

  const email = input.email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ActionError("BAD_REQUEST", "Adresse email invalide.");
  }
  if (await authRepository.findByEmail(email)) {
    throw new ActionError("CONFLICT", "Un compte existe déjà avec cet email.");
  }

  const createdUser = await authRepository.create({
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    email,
    passwordHash: await argon2.hash(input.password),
  });
  if (!createdUser) throw new Error("User creation failed.");

  return {
    user: publicUser(createdUser),
    token: jwtUtil.signToken({ id_user: createdUser.id_user }),
  };
};

const login = async (input: LoginInput) => {
  validateCredentials(input);
  const user = await authRepository.findByEmail(
    input.email.trim().toLowerCase(),
  );
  if (!user || !(await argon2.verify(user.password_hash, input.password))) {
    throw new ActionError("UNAUTHORIZED", "Email ou mot de passe invalide.");
  }
  return {
    user: publicUser(user),
    token: jwtUtil.signToken({ id_user: user.id_user }),
  };
};

const getCurrentUser = async (userId: number) => {
  const user = await authRepository.findById(userId);
  if (!user) {
    throw new ActionError("UNAUTHORIZED", "Authentification requise.");
  }
  return user;
};

const getProfile = async (
  authenticatedUserId: number,
  requestedUserId: number,
) => {
  if (!Number.isInteger(requestedUserId) || requestedUserId < 1) {
    throw new ActionError("BAD_REQUEST", "Identifiant utilisateur invalide.");
  }
  if (authenticatedUserId !== requestedUserId) {
    throw new ActionError("FORBIDDEN", "Accès interdit.");
  }
  const user = await authRepository.findById(requestedUserId);
  if (!user) throw new ActionError("NOT_FOUND", "Utilisateur introuvable.");
  return user;
};

const logout = () => undefined;

export default { register, login, getCurrentUser, getProfile, logout };
