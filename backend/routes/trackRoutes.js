import express from 'express';
import {
  getAllTracks, getTrackById, createTrack, updateTrack, deleteTrack, searchTracks,
  getAlbums, getTopTracks, getRecommendations, registerPlay, toggleTrackLike,
} from '../controllers/trackController.js';
import { protect, admin } from '../middleware/auth.js'; 
import { checkSubscription } from '../middleware/subscription.js';

const router = express.Router();

router.get('/', getAllTracks);
router.get('/search', searchTracks);
router.get('/albums', getAlbums);
router.get('/charts/top', getTopTracks);
router.get('/recommendations/:userId', getRecommendations);
router.get('/:id', getTrackById); 
router.post('/:id/play', protect, checkSubscription('free'), registerPlay);
router.post('/:id/like', protect, toggleTrackLike);
router.put('/:id', protect, admin, updateTrack);
router.delete('/:id', protect, admin, deleteTrack);

export default router;