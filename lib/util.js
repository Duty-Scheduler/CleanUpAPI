import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "60m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};