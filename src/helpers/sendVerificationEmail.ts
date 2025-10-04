import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"True Feedback" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code - True Feedback",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color:#144419;">Hi ${username},</h2>
          <p>Thank you for signing up! Use the code below to verify your account:</p>
          <h3 style="color:#144419; font-size:22px;">${verifyCode}</h3>
          <p style="font-size:14px; color:#555;">
            This code will expire in 10 minutes.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
