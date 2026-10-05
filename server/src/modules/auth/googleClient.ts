import { OAuth2Client } from "google-auth-library";

function getClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REDIRECT_URI are required.",
    );
  }
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

const getAuthUrl = () =>
  getClient().generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
  });

type GoogleProfile = {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
};

const getProfileFromCode = async (code: string): Promise<GoogleProfile> => {
  const client = getClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) {
    throw new Error("Google n'a renvoyé aucun jeton d'identité.");
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new Error("Profil Google invalide ou email non vérifié.");
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    firstName: payload.given_name ?? "Compte",
    lastName: payload.family_name ?? "Google",
  };
};

export default { getAuthUrl, getProfileFromCode };
