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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auth success
 */
/**
 * @swagger
 * /api/v1/auth/introspect:
 *   post:
 *     summary: Introspect token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token info
 */
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user (protected)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
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
