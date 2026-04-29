import express from 'express';
import { getUserProfile, updateUserProfile, getSubscription, upgradeSubscription } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = express.Router();

router.get('/subscription/me', protect, getSubscription);
router.post('/subscription/upgrade', protect, upgradeSubscription);

router.route('/:id')
  .get(getUserProfile)
  .put(protect, uploadAvatar, updateUserProfile);

export default router;