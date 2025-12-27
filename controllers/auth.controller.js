import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../lib/util.js";
import { platform } from "os";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  console.log("idToken: " + idToken);
  if (!idToken) {
    return res.status(400).json({ message: 'Missing idToken' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({
      where: { googleId: payload.sub }
    });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        lastname: payload.family_name || '',
        avatar: payload.picture,
        provider: 'google'
      });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const hashedToken = await bcrypt.hash(refreshToken, 1);
    const tokenRecord = await RefreshToken.create({
      hashtoken: hashedToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    });
    return res.status(201).json({
      user: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        lastname: payload.family_name || '',
        avatar: payload.picture || null,
        provider: 'google'
      },
      accessToken,
      refreshToken
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Google auth failed',
      error: err.message
    });
  }
};