import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, refresh, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Тым көп әрекет. 15 минуттан кейін қайталап көріңіз' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;