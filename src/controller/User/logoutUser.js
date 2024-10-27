import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("isVerified", {
    httpOnly: false,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  const userName = req.user?.firstName || "You";

  res.json(new ApiResponse(200, `${userName} bye bye !, I'm gonna miss you`));
});

export { logoutUser };
