import { assertMailerConfigured, mailer } from "@/lib/mailer";

export async function sendOtpEmail(email: string, otp: string) {
  assertMailerConfigured();

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Your Khushi Enterprise verification code",
    text: `Your verification code is ${otp}. It expires in 5 minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 5 minutes.</p>`,
  });
}
