import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ??
  "2h") as SignOptions["expiresIn"];

type TokenPayload = {
  id_user: number;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  return secret;
}

const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, getSecret());
  if (typeof decoded === "string" || typeof decoded.id_user !== "number") {
    throw new Error("Invalid authentication token.");
  }
  return { id_user: decoded.id_user };
};

export default { signToken, verifyToken };
export type { TokenPayload };
