/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task management
 */
/**
 * @swagger
 * /api/v1/task/group/{groupId}:
 *   get:
 *     summary: Get all tasks in a group (protected)
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
/**
 * @swagger
 * /api/v1/task/{taskId}/proof:
 *   post:
 *     summary: Upload proof image for a task (protected)
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Proof uploaded
 */
import express from "express";
import {
  getAllTaskInGroup,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  uploadProof,
} from "../controllers/task.controller.js";

import { protectedRoute } from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

/**
 * GET
 */
router.get("/group/:groupId", protectedRoute, getAllTaskInGroup);
router.get("/me", protectedRoute, getMyTasks);

/**
 * POST
 */
router.post("/group/:groupId", protectedRoute, createTask);
router.post(
  "/:taskId/proof",
  protectedRoute,
  upload.single("image"),
  uploadProof
);

/**
 * PUT
 */
router.put("/:taskId", protectedRoute, updateTask);

/**
 * DELETE
 */
router.delete("/:taskId", protectedRoute, deleteTask);

export default router;
