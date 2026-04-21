import { getResendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  // If no API key, just skip email sending gracefully
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping welcome email");
    return;
  }

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to Yapa!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
      console.error("[email] Failed to send welcome email:", error);
      return; // don't throw — email failure shouldn't break signup
    }

    console.log("[email] Welcome email sent to", email);
  } catch (err) {
    console.error("[email] Unexpected error:", err.message);
  }
};
