import { User, Track, Review } from '../models/index.js';

export const toggleFollow = async (req, res) => {
  try {
    const me = await User.findByPk(req.user.id);
    const target = await User.findByPk(req.params.userId);
    if (!me || !target) return res.status(404).json({ message: 'User not found' });

    const meFollowing = me.following || [];
    const targetFollowers = target.followers || [];
    const isFollowing = meFollowing.includes(target.id);
    me.following = isFollowing ? meFollowing.filter((id) => id !== target.id) : [...meFollowing, target.id];
    target.followers = isFollowing ? targetFollowers.filter((id) => id !== me.id) : [...targetFollowers, me.id];
    await me.save();
    await target.save();

    res.json({ following: me.following, followers: target.followers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getActivityFeed = async (req, res) => {
  try {
    const me = await User.findByPk(req.user.id);
    const followingIds = me?.following || [];
    const tracks = await Track.findAll({ limit: 20, order: [['createdAt', 'DESC']] });
    res.json({
      followingCount: followingIds.length,
      activities: tracks.map((track) => ({ type: 'track_played', trackId: track.id, title: track.title })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const review = await Review.create({
      comment,
      rating: 5,
      UserId: req.user.id,
      TrackId: req.params.trackId,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reactToTrack = async (req, res) => {
  res.json({ message: 'Reaction recorded', reaction: req.body?.reaction || '❤️', trackId: req.params.trackId });
};

export const getLeaderboard = async (req, res) => {
  try {
    const topListeners = await User.findAll({ order: [['playCount', 'DESC']], limit: 10 });
    const topTracks = await Track.findAll({ order: [['plays', 'DESC']], limit: 10 });
    res.json({
      topListeners: topListeners.map((user) => ({ id: user.id, username: user.username, playCount: user.playCount })),
      trendingTracks: topTracks.map((track) => ({ id: track.id, title: track.title, plays: track.plays })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
