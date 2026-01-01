import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import { v4 as uuidv4 } from 'uuid';
import {
  generateAccessToken,
  generateRefreshToken
} from "../lib/util.js";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
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
    const refreshTokenId = uuidv4();
    return res.status(200).json({
      user: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        lastname: payload.family_name || '',
        avatar: payload.picture || null,
        provider: 'google'
      },
      accessToken,
      refreshToken,
      refreshTokenId
    });
  } catch (err) {
    return res.status(401).json({
      message: 'Google auth failed',
      error: err.message
    });
  }
};

export const introspect = async (req,res) => {
  const {refreshToken,refreshTokenId} = req.body;
  if (!refreshToken || !refreshTokenId) {
    return res.status(400).json({
      message: "Missing refreshToken or refreshTokenId"
    });
  }
  const refreshToken_record = await RefreshToken.findOne(
    { where: { id: refreshTokenId } }
  );
  if(refreshToken_record){
    return res.status(401).json({
        message: "Refresh token revoked or expired"
    })
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const new_refreshTokenId = uuidv4();
    await RefreshToken.create({
      id: refreshTokenId,
      token: refreshToken, 
      UserId: decoded.userId
    });
    const user = await User.findByPk(decoded.userId);
    const accessToken = generateAccessToken(user);
    const new_refreshToken = generateRefreshToken(user);
    
    return res.status(200).json({
      user: {
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        lastname: user.lastname || '',
        avatar: user.avatar || null,
        provider: 'google'
      },
      accessToken,
      refreshToken: new_refreshToken,
      refreshTokenId: new_refreshTokenId
    });
  } catch (error) {
    console.log("Error in auth.controller.js-introspect: " + error);
    return res.status(401).json({
        message: "Invalid RefreshToken"
    })
  }
}

export const logout = async (req,res) => {
  const {refreshToken,refreshTokenId} = req.body;
  if (!refreshToken || !refreshTokenId) {
    return res.status(400).json({
      message: "Missing refreshToken or refreshTokenId"
    });
  }
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    refreshToken = await RefreshToken.create({
      id: refreshTokenId,
      token: refreshToken, 
      UserId: decoded.userId
    });
    return res.status(200).json({
      message: "Logout successfull"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Bag request"
    })
  }
}