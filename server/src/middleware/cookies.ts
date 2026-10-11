import type { Request } from "express";

export function readCookie(req: Request, name: string) {
  const entry = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!entry) return null;
  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return null;
  }
}
