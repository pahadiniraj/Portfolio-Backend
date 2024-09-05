const setTokenCookies = (
  res,
  refreshToken,
  accessToken,
  newAccessTokenExp,
  newRefreshTokenExp
) => {
  const accessTokenMaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  // set cookie for access token

  res.cookie("accessToken", accessToken, {
    maxAge: accessTokenMaxAge,
    httpOnly: true,
    secure: true,
  });

  // set cookie for refresh token

  res.cookie("refreshToken", refreshToken, {
    maxAge: refreshTokenMaxAge,
    httpOnly: true,
    secure: true,
  });
};

export default setTokenCookies;
