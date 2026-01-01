/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Google authentication
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token (credential)
 *     responses:
 *       200:
 *         description: Auth success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     googleId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                     provider:
 *                       type: string
 *                       example: google
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 refreshTokenId:
 *                   type: string
 *       400:
 *         description: Missing idToken
 *       401:
 *         description: Google auth failed
 */

/**
 * @swagger
 * /api/v1/auth/introspect:
 *   post:
 *     summary: Introspect refresh token and issue new tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *               - refreshTokenId
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh JWT previously issued to the client
 *               refreshTokenId:
 *                 type: string
 *                 description: Client-side identifier for the refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     googleId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                     provider:
 *                       type: string
 *                       example: google
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 refreshTokenId:
 *                   type: string
 *       400:
 *         description: Missing refreshToken or refreshTokenId
 *       401:
 *         description: Invalid refresh token or refresh token revoked/expired
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user (protected)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *               - refreshTokenId
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh JWT to revoke
 *               refreshTokenId:
 *                 type: string
 *                 description: Client-side identifier for the refresh token
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       400:
 *         description: Missing refreshToken or refreshTokenId
 *       401:
 *         description: Invalid refresh token
 */

import express from "express";
import {
  googleAuth,
  introspect,
  logout,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/google", googleAuth);
router.post("/introspect", introspect);
router.post("/logout", protectedRoute, logout);

export default router;
