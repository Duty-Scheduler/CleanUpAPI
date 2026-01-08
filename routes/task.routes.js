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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: List of tasks in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupId:
 *                   type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       proof:
 *                         type: array
 *                       Users:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             avatar:
 *                               type: string
 *                             UserGroupTask:
 *                               type: object
 *                               properties:
 *                                 penalty_status:
 *                                   type: boolean
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Create a new task in a group (protected, admin only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - penalty_description
 *               - assignId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               description:
 *                 type: string
 *                 description: Task description
 *               penalty_description:
 *                 type: string
 *                 description: Penalty description for failing task
 *               assignId:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs to assign this task
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created
 *                 task:
 *                   type: object
 *       400:
 *         description: Missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/task/me:
 *   get:
 *     summary: Get all tasks assigned to the current user (protected)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 total:
 *                   type: integer
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       proof:
 *                         type: array
 *                       Group:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/task/{taskId}:
 *   put:
 *     summary: Update a task (protected, admin only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               description:
 *                 type: string
 *                 description: Task description
 *               status:
 *                 type: boolean
 *                 description: Task completion status
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task updated
 *                 task:
 *                   type: object
 *       400:
 *         description: No valid fields provided for update
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a task (protected, admin only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/task/{taskId}/proof:
 *   post:
 *     summary: Upload proof image for a task (protected)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Proof image file
 *     responses:
 *       200:
 *         description: Proof uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Proof uploaded successfully
 *                 proof:
 *                   type: object
 *                   properties:
 *                     img:
 *                       type: string
 *                     user_email:
 *                       type: string
 *                     uploaded_at:
 *                       type: string
 *                       format: date-time
 *                 taskId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: No image file provided or missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User not allowed to upload proof for this task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/v1/task/group/{groupId}/tasks/by-date:
 *   get:
 *     summary: Get tasks in a group by specific date (protected, group members only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-01-07
 *         description: Date to filter tasks (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of tasks in the group for the given date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupId:
 *                   type: string
 *                   format: uuid
 *                 date:
 *                   type: string
 *                   example: 2026-01-07
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: boolean
 *                       proof:
 *                         type: array
 *                         items:
 *                           type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       Users:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             avatar:
 *                               type: string
 *                             UserGroupTask:
 *                               type: object
 *                               properties:
 *                                 penalty_status:
 *                                   type: boolean
 *       400:
 *         description: Missing or invalid date query parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (group members only)
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/v1/task/myTask/by-date:
 *   get:
 *     summary: Get current user's tasks by specific date (protected)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-01-08
 *         description: Date to filter tasks (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of user's tasks for the given date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: 2026-01-08
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Finish report"
 *                       description:
 *                         type: string
 *                         example: "Complete the weekly progress report"
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                       proof:
 *                         type: string
 *                         nullable: true
 *                         example: "https://example.com/proof.png"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       Users:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             avatar:
 *                               type: string
 *                             TaskUser:
 *                               type: object
 *                               properties:
 *                                 penalty_status:
 *                                   type: string
 *                                   example: "none"
 *       400:
 *         description: Missing or invalid date query parameter
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /api/v1/task/group/{groupId}/task/{taskId}:
 *   get:
 *     summary: Get task detail by ID in a group (protected, group members only)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the task
 *     responses:
 *       200:
 *         description: Task detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     proof:
 *                       type: array
 *                       items:
 *                         type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     Users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           UserGroupTask:
 *                             type: object
 *                             properties:
 *                               penalty_status:
 *                                 type: boolean
 *       400:
 *         description: Missing groupId or taskId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (group members only)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */

import express from "express";
import {
  getAllTaskInGroup,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  uploadProof,
  getTasksByDate,
  getUserTasksByDate,
  getTaskById
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

router.get(
  "/group/:groupId/tasks/by-date",
  protectedRoute,
  getTasksByDate
);

router.get(
  "/group/:groupId/tasks/by-date",
  protectedRoute,
  getTasksByDate
);

router.get(
  "/myTask/by-date",
  protectedRoute,
  getUserTasksByDate
);

router.get(
  "/group/:groupId/task/:taskId",
  protectedRoute,
  getTaskById
)

export default router;
