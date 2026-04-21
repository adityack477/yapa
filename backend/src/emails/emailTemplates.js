export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Yapa</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #f5f5f5; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f0f;">
    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">💬 Yapa</h1>
      <p style="color: rgba(0,0,0,0.6); margin-top: 6px; font-size: 14px; font-weight: 500;">Real-time messaging, built different</p>
    </div>

    <div style="background-color: #1a1a1a; padding: 36px; border-radius: 0 0 16px 16px; border: 1px solid #2a2a2a; border-top: none;">
      <p style="font-size: 18px; color: #f59e0b; font-weight: 600; margin-bottom: 4px;">Hey ${name} 👋</p>
      <p style="color: #a3a3a3; margin-top: 0;">Welcome to Yapa! Your account is all set. Start messaging anyone on the platform in real time.</p>

      <div style="background-color: #111; padding: 24px; border-radius: 12px; margin: 24px 0; border-left: 3px solid #f59e0b;">
        <p style="font-size: 14px; margin: 0 0 12px 0; color: #e5e5e5; font-weight: 600;">Things you can do on Yapa:</p>
        <ul style="padding-left: 18px; margin: 0; color: #a3a3a3; font-size: 14px;">
          <li style="margin-bottom: 8px;">Upload a profile picture in Settings</li>
          <li style="margin-bottom: 8px;">Go to Contacts and start your first chat</li>
          <li style="margin-bottom: 8px;">React to messages with emoji reactions ❤️ 😂 🔥</li>
          <li style="margin-bottom: 0;">Share images directly in any conversation</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${clientURL}" style="background: #f59e0b; color: #000; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; display: inline-block; font-size: 15px;">
          Open Yapa →
        </a>
      </div>

      <p style="color: #525252; font-size: 12px; margin-top: 28px;">If you didn't create this account, you can safely ignore this email.</p>
    </div>

    <div style="text-align: center; padding: 20px; color: #525252; font-size: 12px;">
      <p>© 2025 Yapa · Built by Aditya Kadam</p>
    </div>
  </body>
  </html>
  `;
}
