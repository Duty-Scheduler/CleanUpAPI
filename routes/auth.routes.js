import express from 'express';
import { googleAuth, introspect, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/introspect', introspect);
router.post('/logout', logout);

export default router;
