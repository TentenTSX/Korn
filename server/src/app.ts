import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import router from "./router";

const app = express();

if (process.env.CLIENT_URL != null) {
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
}

app.use(
  "/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Route API introuvable." });
});

const publicFolderPath = path.join(__dirname, "../../server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

const clientBuildPath = path.join(__dirname, "../../client/dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (_, res) => {
    res.sendFile("index.html", { root: clientBuildPath });
  });
}

// Error-handling middleware must be registered last.
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  console.error("on req:", req.method, req.path);
  next(err);
};

app.use(logErrors);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    res.status(400).json({ message: "Corps de requête invalide." });
    return;
  }

  const statusByCode: Record<string, number> = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
  };
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String(err.code)
      : "";
  const status = statusByCode[code] ?? 500;
  const message =
    status < 500 && typeof err.message === "string"
      ? err.message
      : "Une erreur interne est survenue.";
  res.status(status).json({ message });
};

app.use(errorHandler);

export default app;
