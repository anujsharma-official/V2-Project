import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for an admin
 * @param {string} adminId - The ID of the admin (MongoDB _id)
 * @returns {string} JWT token
 */
export const generateToken = (adminId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in .env");
  }

  return jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};
