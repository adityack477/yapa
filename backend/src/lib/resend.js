import { Resend } from "resend";
import { ENV } from "./env.js";

// Lazily create the client so missing key doesn't crash on startup
let _client = null;

export function getResendClient() {
  if (!ENV.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set in your .env file");
  }
  if (!_client) {
    _client = new Resend(ENV.RESEND_API_KEY);
  }
  return _client;
}

export const sender = {
  email: ENV.EMAIL_FROM || "onboarding@resend.dev",
  name: ENV.EMAIL_FROM_NAME || "Yapa",
};
