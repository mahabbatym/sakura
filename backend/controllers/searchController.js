import { Op } from 'sequelize';
import { Track, Artist } from '../models/index.js';

export const globalSearch = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ tracks: [], artists: [], albums: [] });

    const tracks = await Track.findAll({
      where: { title: { [Op.iLike]: `%${q}%` } },
      include: [{ model: Artist, attributes: ['id', 'name', 'image'] }],
      limit: 20,
    });
    const artists = await Artist.findAll({
      where: { name: { [Op.iLike]: `%${q}%` } },
      limit: 20,
    });
    const albums = tracks.map((track) => ({
      id: track.id,
      title: track.title,
      coverUrl: track.cover_image,
      artist: track.Artist?.name,
    }));

    res.json({ tracks, artists, albums });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
