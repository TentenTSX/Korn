import "dotenv/config";
import { spawn } from "node:child_process";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const port = process.env.APP_PORT ?? "3310";

if (!stripeApiKey) {
  throw new Error("STRIPE_SECRET_KEY must be configured before dev:stripe.");
}

let apiProcess: ReturnType<typeof spawn> | null = null;
let stripeOutput = "";
let shuttingDown = false;

const stripeProcess = spawn(
  "stripe",
  [
    "listen",
    "--events",
    "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired",
    "--forward-to",
    `localhost:${port}/api/payments/stripe/webhook`,
  ],
  {
    env: { ...process.env, STRIPE_API_KEY: stripeApiKey },
    stdio: ["inherit", "pipe", "pipe"],
  },
);

function stopProcesses() {
  if (shuttingDown) return;
  shuttingDown = true;
  stripeProcess.kill("SIGTERM");
  apiProcess?.kill("SIGTERM");
}

function consumeStripeOutput(chunk: Buffer) {
  stripeOutput += chunk.toString();
  const lines = stripeOutput.split(/\r?\n/);
  stripeOutput = lines.pop() ?? "";

  for (const line of lines) {
    const match = line.match(/(whsec_[A-Za-z0-9]+)/);
    if (match) {
      process.env.STRIPE_WEBHOOK_SECRET = match[1];
      if (!apiProcess) {
        console.info("Stripe webhook signing secret received (redacted).");
        apiProcess = spawn("npm", ["run", "dev"], {
          env: {
            ...process.env,
            APP_PORT: port,
            STRIPE_WEBHOOK_SECRET: match[1],
          },
          stdio: "inherit",
        });
        apiProcess.on("error", (error) => {
          console.error(
            "Could not start the API development server.",
            error.message,
          );
          stopProcesses();
        });
        apiProcess.on("exit", (code) => {
          if (!shuttingDown) {
            process.exitCode = code ?? 1;
            stopProcesses();
          }
        });
      }
    }

    const safeLine = line.replace(/whsec_[A-Za-z0-9]+/g, "whsec_[redacted]");
    if (safeLine.trim()) console.info(`[stripe] ${safeLine}`);
  }
}

stripeProcess.stdout?.on("data", consumeStripeOutput);
stripeProcess.stderr?.on("data", consumeStripeOutput);
stripeProcess.on("error", (error) => {
  console.error(
    "Stripe CLI could not start. Install it and ensure `stripe` is on PATH.",
    error.message,
  );
  process.exitCode = 1;
});
stripeProcess.on("exit", (code) => {
  if (!shuttingDown) {
    if (code !== 0) process.exitCode = code ?? 1;
    stopProcesses();
  }
});

process.on("SIGINT", stopProcesses);
process.on("SIGTERM", stopProcesses);
