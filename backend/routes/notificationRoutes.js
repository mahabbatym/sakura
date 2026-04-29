import express from 'express';
import { protect } from '../middleware/auth.js';
import { sendPushNotification, sendWeeklyDigest } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/push', protect, sendPushNotification);
router.post('/digest', protect, sendWeeklyDigest);

export default router;
