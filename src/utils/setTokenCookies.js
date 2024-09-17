const setTokenCookies = (
  res,
  accessToken,
  newAccessTokenExp,
  refreshToken,
  newRefreshTokenExp,
  isVerified,
  role
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
  });

  // set cookie for refresh token

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: refreshTokenMaxAge,
  });

  res.cookie("isVerified", isVerified, {
    httpOnly: false,
    secure: false,
    maxAge: refreshTokenMaxAge,
  });
  res.cookie("role", role, {
    httpOnly: false,
    secure: false,
    maxAge: refreshTokenMaxAge,
  });
};

export default setTokenCookies;
