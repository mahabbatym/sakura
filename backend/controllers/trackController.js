import { Track, Artist, Review, User } from '../models/index.js';
import { Op } from 'sequelize';
import { getCache, setCache } from '../utils/cache.js';

export const getAllTracks = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const rawLimit = req.query.limit;
    const limit = rawLimit === 'all'
      ? null
      : Math.min(1000, Math.max(1, Number(rawLimit || 100)));
    const offset = limit === null ? 0 : (page - 1) * limit;
    const cacheKey = `tracks:${page}:${rawLimit || limit || 'all'}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const query = {
      include: [{ model: Artist, attributes: ['id', 'name', 'image'] }],
      order: [['createdAt', 'DESC']],
    };
    if (limit !== null) {
      query.limit = limit;
      query.offset = offset;
    }

    const tracks = await Track.findAll(query);
    await setCache(cacheKey, tracks, 600);
    res.setHeader('X-Page', String(page));
    res.setHeader('X-Limit', String(limit ?? 'all'));
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTrackById = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id, {
      include: [
        { model: Artist, attributes: ['id', 'name', 'image'] },
        { model: Review, include: [{ model: User, attributes: ['id', 'username', 'avatar'] }] }
      ]
    });
    if (!track) return res.status(404).json({ message: 'Track not found' });
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTrack = async (req, res) => {
  try {
    const { title, duration, artistId } = req.body;
    const file_url = req.files?.audio ? `/uploads/audio/${req.files.audio[0].filename}` : null;
    const cover_image = req.files?.image ? `/uploads/images/${req.files.image[0].filename}` : null;
    if (!title || !file_url) return res.status(400).json({ message: 'Title and audio file required' });
    const track = await Track.create({ title, duration, file_url, cover_image, artistId });
    res.status(201).json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTrack = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    await track.update(req.body);
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTrack = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    await track.destroy();
    res.json({ message: 'Track deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchTracks = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const tracks = await Track.findAll({
      where: { title: { [Op.iLike]: `%${q}%` } },
      include: [{ model: Artist, attributes: ['id', 'name', 'image'] }],
      limit: 20,
    });
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const tracks = await Track.findAll({
      include: [{ model: Artist, attributes: ['id', 'name', 'image'] }],
      order: [['createdAt', 'DESC']],
    });
    const albumsMap = new Map();
    tracks.forEach((track) => {
      const albumKey = track.cover_image || track.title;
      if (!albumsMap.has(albumKey)) {
        albumsMap.set(albumKey, {
          id: albumKey,
          title: track.title,
          artist: track.Artist?.name || 'Various',
          coverUrl: track.cover_image,
          tracks: [],
        });
      }
      albumsMap.get(albumKey).tracks.push(track);
    });
    res.json(Array.from(albumsMap.values()));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopTracks = async (req, res) => {
  try {
    const cached = await getCache('charts:top50');
    if (cached) return res.json(cached);
    const tracks = await Track.findAll({
      include: [{ model: Artist, attributes: ['id', 'name', 'image'] }],
      order: [['plays', 'DESC']],
      limit: 50,
    });
    await setCache('charts:top50', tracks, 600);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const liked = user?.likedTracks || [];
    const tracks = await Track.findAll({
      include: [{ model: Artist, attributes: ['id', 'name', 'image'] }],
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    const scored = tracks.sort((a, b) => {
      const aScore = liked.includes(a.id) ? -1 : 1;
      const bScore = liked.includes(b.id) ? -1 : 1;
      return aScore - bScore;
    });
    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerPlay = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    track.plays += 1;
    await track.save();

    if (req.user?.id) {
      const user = await User.findByPk(req.user.id);
      if (user) {
        user.playCount += 1;
        await user.save();
      }
    }
    res.json({ message: 'Play counted', plays: track.plays });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleTrackLike = async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    const user = await User.findByPk(req.user.id);
    const current = user.likedTracks || [];
    const next = current.includes(track.id)
      ? current.filter((id) => id !== track.id)
      : [...current, track.id];
    user.likedTracks = next;
    await user.save();
    res.json({ likedTracks: next });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
