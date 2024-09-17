import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const logoutUser = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("isVerified");
  res.clearCookie("role");
  // console.log(res.clearCookie("is_auth"));

  const userName = req.user?.firstName || "You";

  res.json(new ApiResponse(200, `${userName} bye bye !, I'm gonna miss you`));
});
export { logoutUser };
