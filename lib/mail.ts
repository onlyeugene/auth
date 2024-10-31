import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "auth@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href='${confirmLink}'>here</a> to confirm your email.</p>`,
  });
};


export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'auth@resend.dev',
        to: email,
        subject: 'Reset your password',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; text-align: center;">
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 20px;">
              <h2 style="color: #333;">Password Reset Request</h2>
              <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
              <a href="${resetLink}" style="
                  display: inline-block;
                  background-color: #4caf50;
                  color: #ffffff;
                  padding: 12px 24px;
                  border-radius: 5px;
                  text-decoration: none;
                  font-weight: bold;
                  margin-top: 10px;
                ">Reset Password</a>
              <p style="color: #888; font-size: 14px; margin-top: 20px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
        `
    });
};


export const sendTwoFactorEmail = async (email: string, token: string) => {

  await resend.emails.send({
    from: 'auth@resend.dev',
    to: email,
    subject: '2FA Verification',
    html: `<p>Your 2FA code: ${token}</p>`
  })
}