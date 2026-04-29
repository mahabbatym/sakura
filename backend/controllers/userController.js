import { User, Playlist, Review } from '../models/index.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Playlist },
        { model: Review, include: ['Track'] }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, email, avatar, currentPassword, newPassword, likedTracks } = req.body;
    const uploadedAvatar = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar !== undefined || uploadedAvatar !== undefined) user.avatar = uploadedAvatar ?? avatar;
    if (likedTracks !== undefined) {
      if (Array.isArray(likedTracks)) {
        user.likedTracks = likedTracks;
      } else {
        try {
          const parsedLikedTracks = JSON.parse(likedTracks);
          user.likedTracks = Array.isArray(parsedLikedTracks) ? parsedLikedTracks : [];
        } catch {
          return res.status(400).json({ message: 'likedTracks must be an array' });
        }
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password required' });
      }
      const matches = await user.comparePassword(currentPassword);
      if (!matches) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password_hash = newPassword;
    }

    await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        likedTracks: user.likedTracks || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'subscriptionPlan', 'subscriptionExpiry', 'playCount'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const upgradeSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const planDurations = {
      free: 0,
      premium: 30,
      artist_pro: 30,
    };
    if (!planDurations[plan] && plan !== 'free') {
      return res.status(400).json({ message: 'Жоспар дұрыс емес' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscriptionPlan = plan;
    if (plan === 'free') {
      user.subscriptionExpiry = null;
    } else {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + planDurations[plan]);
      user.subscriptionExpiry = expiresAt;
    }
    await user.save();

    res.json({
      message: 'Жазылым сәтті жаңартылды',
      subscription: {
        plan: user.subscriptionPlan,
        expiry: user.subscriptionExpiry,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};