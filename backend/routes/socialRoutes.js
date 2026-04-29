import express from 'express';
import { protect } from '../middleware/auth.js';
import { toggleFollow, getActivityFeed, addComment, reactToTrack, getLeaderboard } from '../controllers/socialController.js';

const router = express.Router();

router.post('/follow/:userId', protect, toggleFollow);
router.get('/feed', protect, getActivityFeed);
router.post('/tracks/:trackId/comments', protect, addComment);
router.post('/tracks/:trackId/reactions', protect, reactToTrack);
router.get('/leaderboard', getLeaderboard);

export default router;
