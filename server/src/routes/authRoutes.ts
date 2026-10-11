import express from "express";
import authenticate from "../middleware/authenticate";
import {
  createOAuthState,
  verifyOAuthState,
} from "../middleware/googleOAuthState";
import {
  accountRateLimiter,
  loginRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/rateLimit";
import authActions from "../modules/auth/authActions";
import {
  cookieOptions,
  currentUserId,
  mergeGuestCart,
  runAction,
} from "./routeHelpers";

const resolveClientUrl = () => process.env.CLIENT_URL ?? "/";

const router = express.Router();

router.post(
  "/api/auth/register",
  runAction(async (req, res) => {
    const result = await authActions.register(req.body);
    await mergeGuestCart(req, res, result.user.id_user, result.user.email);
    res.cookie("auth_token", result.token, cookieOptions);
    res.status(201).json({ user: result.user });
  }),
);

router.post(
  "/api/auth/login",
  loginRateLimiter,
  runAction(async (req, res) => {
    const result = await authActions.login(req.body);
    await mergeGuestCart(req, res, result.user.id_user, result.user.email);
    res.cookie("auth_token", result.token, cookieOptions);
    res.status(200).json({ user: result.user });
  }),
);

router.post(
  "/api/auth/logout",
  runAction(async (_req, res) => {
    await authActions.logout();
    res.clearCookie("auth_token", cookieOptions).sendStatus(204);
  }),
);

router.get(
  "/api/auth/google",
  runAction(async (_req, res) => {
    const state = createOAuthState(res);
    res.redirect(authActions.getGoogleAuthUrl(state));
  }),
);

// Google redirects the browser here directly, so on failure we redirect back
// to the login page instead of returning the app's usual JSON error body.
router.get("/api/auth/google/callback", async (req, res) => {
  try {
    if (!verifyOAuthState(req, res, req.query.state)) {
      throw new Error("État OAuth invalide ou expiré.");
    }
    const code = req.query.code;
    if (typeof code !== "string") {
      throw new Error("Code Google manquant.");
    }
    const result = await authActions.loginWithGoogleCode(code);
    await mergeGuestCart(req, res, result.user.id_user, result.user.email);
    res.cookie("auth_token", result.token, cookieOptions);
    res.redirect(`${resolveClientUrl()}/profile/dashboard`);
  } catch (err) {
    console.error(err);
    res.redirect(`${resolveClientUrl()}/profile?error=google`);
  }
});

router.post(
  "/api/auth/password-reset/request",
  passwordResetRateLimiter,
  runAction(async (req, res) => {
    await authActions.requestPasswordReset(req.body?.email);
    res.sendStatus(204);
  }),
);

router.post(
  "/api/auth/password-reset/confirm",
  runAction(async (req, res) => {
    await authActions.confirmPasswordReset(req.body?.token, req.body?.password);
    res.sendStatus(204);
  }),
);

router.get(
  "/api/auth/me",
  authenticate,
  runAction(async (req, res) => {
    res.json(await authActions.getCurrentUser(currentUserId(req)));
  }),
);

router.get(
  "/api/users/:id",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await authActions.getProfile(currentUserId(req), Number(req.params.id)),
    );
  }),
);

router.patch(
  "/api/users/:id",
  authenticate,
  runAction(async (req, res) => {
    res.json(
      await authActions.updateProfileAction(
        currentUserId(req),
        Number(req.params.id),
        req.body,
      ),
    );
  }),
);

router.patch(
  "/api/users/:id/password",
  authenticate,
  accountRateLimiter,
  runAction(async (req, res) => {
    await authActions.changePasswordAction(
      currentUserId(req),
      Number(req.params.id),
      req.body?.current_password,
      req.body?.new_password,
    );
    res.sendStatus(204);
  }),
);

router.delete(
  "/api/users/:id",
  authenticate,
  runAction(async (req, res) => {
    await authActions.deleteAccountAction(
      currentUserId(req),
      Number(req.params.id),
      req.body?.confirmation,
    );
    res.clearCookie("auth_token", cookieOptions).sendStatus(204);
  }),
);

export default router;
