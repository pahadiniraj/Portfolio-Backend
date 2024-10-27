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
    secure: true,
    maxAge: accessTokenMaxAge,
    sameSite: "None",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: refreshTokenMaxAge,
    sameSite: "None",
  });

  res.cookie("isVerified", isVerified, {
    httpOnly: false,
    secure: true,
    maxAge: refreshTokenMaxAge,
    sameSite: "None",
  });
};

export default setTokenCookies;
