import nodemailer from 'nodemailer';

export const sendPushNotification = async (req, res) => {
  const { token, title, body } = req.body || {};
  if (!token || !title) {
    return res.status(400).json({ message: 'token және title міндетті' });
  }
  // FCM scaffold: replace with firebase-admin send() when credentials configured.
  return res.json({ message: 'Push notification queued (scaffold)', token, title, body });
};

export const sendWeeklyDigest = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'email міндетті' });

    if (!process.env.SMTP_HOST) {
      return res.json({ message: 'SMTP configured емес, digest scaffold орындалды' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@sakura.app',
      to: email,
      subject: 'Sakura Weekly Digest',
      html: '<h2>Sakura Weekly</h2><p>Соңғы жаңалықтар мен тректер.</p>',
    });
    return res.json({ message: 'Weekly digest sent' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
