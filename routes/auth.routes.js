import express from 'express';
import { googleAuth, introspect, logout } from '../controllers/auth.controller.js';
import {protectedRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/introspect', introspect);
router.post('/logout', protectedRoute, logout);

export default router;
