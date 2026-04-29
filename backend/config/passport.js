import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/index.js';

export const setupPassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback';
  if (!clientID || !clientSecret) return;

  passport.use(new GoogleStrategy(
    { clientID, clientSecret, callbackURL },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error('Google email not provided'));
        let user = await User.findOne({ where: { email } });
        if (!user) {
          user = await User.create({
            email,
            username: profile.displayName || email.split('@')[0],
            password_hash: `google_${profile.id}_${Date.now()}`,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ));
};

export default passport;
