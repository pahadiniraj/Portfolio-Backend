const setTokenCookies = (
  res,
  accessToken,
  newAccessTokenExp,
  refreshToken,
  newRefreshTokenExp,
  isVerified
  // role
) => {
  const accessTokenMaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  if (accessTokenMaxAge <= 0 || refreshTokenMaxAge <= 0) {
    throw new Error("Token expiration time is invalid");
  }

  // set cookie for access token

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: accessTokenMaxAge,
    sameSite: "none",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: refreshTokenMaxAge,
    sameSite: "none",
  });

  res.cookie("isVerified", isVerified, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: refreshTokenMaxAge,
    sameSite: "none",
  });
};

export default setTokenCookies;
