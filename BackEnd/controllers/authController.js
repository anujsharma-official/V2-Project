import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(admin._id);
  res.json({ token });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour

  admin.resetToken = resetToken;
  admin.resetTokenExpiry = resetTokenExpiry;
  await admin.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const html = `
  <div style="max-width: 600px; margin: auto; padding: 40px 30px; background-color: #ffffff; border-radius: 12px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" width="64" height="64" alt="Lock Icon" />
      <h2 style="font-size: 24px; color: #111827; margin: 16px 0 4px;">Reset Your Password</h2>
      <p style="color: #6B7280; font-size: 15px; margin: 0;">We received a request to reset your password.</p>
    </div>

    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Hello Admin,<br/><br/>
      To create a new password, click the button below. This link is valid for <strong>1 hour</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a 
        href="${resetUrl}" 
        style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;"
      >
        🔐 Reset Password
      </a>
    </div>

    <p style="color: #6B7280; font-size: 14px;">
      If you didn’t request this, you can ignore this email. Your account is safe.
    </p>

    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />

    <div style="text-align: center; color: #9CA3AF; font-size: 12px;">
      &copy; ${new Date().getFullYear()} Portfolio Admin System. All rights reserved.<br/>
      Need help? Contact support at <a href="mailto:support@yourdomain.com" style="color: #4f46e5;">support@yourdomain.com</a>
    </div>
  </div>
`;
  await sendEmail(admin.email, "Password Reset", html);

  res.json({ message: "Reset link sent to email" });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const admin = await Admin.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

  admin.password = await bcrypt.hash(password, 10);
  admin.resetToken = undefined;
  admin.resetTokenExpiry = undefined;
  await admin.save();

  res.json({ message: "Password reset successful" });
};
