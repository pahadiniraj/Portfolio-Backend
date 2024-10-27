import { Router } from "express";
import "../utils/googleConfig.js";
import passport from "passport";
import setTokenCookies from "../utils/setTokenCookies.js";

const router = Router();

router.route("/auth/google").get(
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_HOST}/login`,
  }),
  (req, res) => {
    const { user, accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      req.user;
    setTokenCookies(
      res,
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp,
      user.isVerified
    );
    res.redirect(`${process.env.FRONTEND_HOST}/dashboard/setting`);
  }
);

export default router;
