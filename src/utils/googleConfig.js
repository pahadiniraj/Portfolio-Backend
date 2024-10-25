import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshToken } from "./AccessAndRefresh.js";
import bcrypt from "bcryptjs";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ email: profile._json.email });

        if (!user) {
          const lastSixDigitId = profile.id.substring(profile.id.length - 6);
          const lastTwoDigitName = profile._json.name.substring(
            profile._json.name.length - 2
          );
          const password = lastSixDigitId + lastTwoDigitName;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          user = await User.create({
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            email: profile._json.email,
            avatar: profile._json.picture,
            isVerified: true,
            password: hashedPassword,
          });
        }

        const { accessToken, accessTokenExp, refreshToken, refreshTokenExp } =
          await generateAccessAndRefreshToken(user);
        return done(null, {
          user,
          accessToken,
          accessTokenExp,
          refreshToken,
          refreshTokenExp,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);
