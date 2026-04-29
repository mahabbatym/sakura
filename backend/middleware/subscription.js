import { User } from '../models/index.js';

const planRank = {
  free: 0,
  premium: 1,
  artist_pro: 2,
};

export const checkSubscription = (requiredPlan = 'free') => async (req, res, next) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Not authorized' });
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'subscriptionPlan', 'subscriptionExpiry', 'playCount'],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const plan = user.subscriptionPlan || 'free';
    const now = new Date();
    const lastReset = user.playCountResetAt ? new Date(user.playCountResetAt) : null;
    const shouldResetDaily = !lastReset || (now - lastReset) >= 24 * 60 * 60 * 1000;
    if (shouldResetDaily) {
      user.playCount = 0;
      user.playCountResetAt = now;
      await user.save();
    }

    const hasExpired = !!user.subscriptionExpiry && new Date(user.subscriptionExpiry) < new Date();
    if (hasExpired && plan !== 'free') {
      user.subscriptionPlan = 'free';
      user.subscriptionExpiry = null;
      await user.save();
    }

    if ((planRank[user.subscriptionPlan || 'free'] || 0) < (planRank[requiredPlan] || 0)) {
      return res.status(403).json({ message: 'Бұл функция үшін жоғары жоспар қажет' });
    }

    if ((user.subscriptionPlan || 'free') === 'free' && user.playCount >= 10) {
      return res.status(403).json({ message: 'Free лимит: күніне 10 тыңдау' });
    }

    req.subscription = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
