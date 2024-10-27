import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, path: "/" });
  res.clearCookie("accessToken", { httpOnly: true, path: "/" });
  res.clearCookie("isVerified", { httpOnly: true, path: "/" });

  const userName = req.user?.firstName || "You";

  res.json(new ApiResponse(200, `${userName} bye bye !, I'm gonna miss you`));
});

export { logoutUser };
