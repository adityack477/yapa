import { ENV } from "./env.js";

let aj = null;

// Only initialise Arcjet if a key is provided.
// This lets the server start in development without an Arcjet account.
if (ENV.ARCJET_KEY) {
  const { default: arcjet, shield, detectBot, slidingWindow } = await import("@arcjet/node");

  aj = arcjet({
    key: ENV.ARCJET_KEY,
    rules: [
      shield({ mode: "LIVE" }),
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE"],
      }),
      slidingWindow({ mode: "LIVE", max: 100, interval: 60 }),
    ],
  });

  console.log("[arcjet] Rate limiting enabled");
} else {
  console.warn("[arcjet] ARCJET_KEY not set — rate limiting disabled");
}

export default aj;
