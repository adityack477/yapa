import aj from "../lib/arcjet.js";

export const arcjetProtection = async (req, res, next) => {
  if (!aj) return next();
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ message: "Too many requests. Please slow down." });
      if (decision.reason.isBot())
        return res.status(403).json({ message: "Bot traffic is not allowed." });
      return res.status(403).json({ message: "Request denied." });
    }
    next();
  } catch (err) {
    console.error("[arcjet] middleware error:", err.message);
    next();
  }
};