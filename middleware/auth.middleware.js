import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const protectedRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Missing or invalid Authorization header"
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // gắn user cho controller dùng
    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(401).json({
      message: "Invalid or expired AccessToken"
    });
  }
};
