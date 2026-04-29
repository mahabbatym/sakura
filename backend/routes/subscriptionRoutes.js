import express from 'express';
import { protect } from '../middleware/auth.js';
import { getSubscription, upgradeSubscription } from '../controllers/userController.js';

const router = express.Router();

router.get('/user/subscription', protect, getSubscription);
router.post('/subscription/upgrade', protect, upgradeSubscription);

export default router;
