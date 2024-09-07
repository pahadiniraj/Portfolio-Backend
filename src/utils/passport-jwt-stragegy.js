import passport from "passport";
import { User } from "../models/user.model.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payLoad, done) {
    try {
      const user = await User.findOne({ _id: jwt_payLoad._id }).select(
        "-password"
      );
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);
