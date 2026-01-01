import express from 'express';
import {createGroup, getJoinedGroup, leaveGroup, deleteGroup, createInviteToken, joinGroup} 
    from '../controllers/group.controller.js'
import {protectedRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectedRoute, createGroup);
router.post('/:groupId/invite', protectedRoute, createInviteToken);
router.post('/join', protectedRoute, joinGroup);
router.get('/joined', protectedRoute, getJoinedGroup);
router.delete('/:groupId/leave', protectedRoute, leaveGroup);
router.delete('/:groupId', protectedRoute, deleteGroup);


export default router;