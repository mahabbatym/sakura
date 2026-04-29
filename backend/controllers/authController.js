import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
const ACCESS_TTL = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_SALT_ROUNDS = 12;

const generateAccessToken = (id) => jwt.sign({ id }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
const generateRefreshToken = (id) => jwt.sign({ id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });

const buildAuthPayload = (user, accessToken, refreshToken) => ({
  token: accessToken,
  accessToken,
  refreshToken,
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    likedTracks: user.likedTracks || [],
  },
});

export const register = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Барлық өріс міндетті' });
    }
    if (/^\d+$/.test(email)) {
      return res.status(400).json({ message: 'Email тек сандардан тұра алмайды' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email форматы дұрыс емес' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Құпия сөз кемінде 6 таңба болуы керек' });
    }
    if (String(username).trim().length < 2) {
      return res.status(400).json({ message: 'Пайдаланушы аты кемінде 2 таңба болуы керек' });
    }

    const user = await User.create({ username, email, password_hash: password });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.refresh_token_hash = await bcrypt.hash(refreshToken, REFRESH_SALT_ROUNDS);
    await user.save();

    res.status(201).json(buildAuthPayload(user, accessToken, refreshToken));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'Бұл email немесе пайдаланушы аты бұрыннан тіркелген' });
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email және құпия сөз міндетті' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Email немесе құпия сөз қате' });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.refresh_token_hash = await bcrypt.hash(refreshToken, REFRESH_SALT_ROUNDS);
    await user.save();

    res.json(buildAuthPayload(user, accessToken, refreshToken));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token міндетті' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user?.refresh_token_hash) {
      return res.status(401).json({ message: 'Refresh token жарамсыз' });
    }

    const matches = await bcrypt.compare(refreshToken, user.refresh_token_hash);
    if (!matches) {
      return res.status(401).json({ message: 'Refresh token жарамсыз' });
    }

    const accessToken = generateAccessToken(user.id);
    const nextRefreshToken = generateRefreshToken(user.id);
    user.refresh_token_hash = await bcrypt.hash(nextRefreshToken, REFRESH_SALT_ROUNDS);
    await user.save();

    res.json({ token: accessToken, accessToken, refreshToken: nextRefreshToken });
  } catch (err) {
    res.status(401).json({ message: 'Refresh token мерзімі өткен немесе қате' });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token міндетті' });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (user) {
      user.refresh_token_hash = null;
      await user.save();
    }
    res.json({ message: 'Сәтті шықтыңыз' });
  } catch (err) {
    res.status(400).json({ message: 'Шығу мүмкін болмады' });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};