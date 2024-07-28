import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const getAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const acessToken = await user.generateAccessToken();

    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { acessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "internal server error generating the tokens");
  }
};
const registerUser = asyncHandler((req, res) => {
  console.log("hello");
});

export { registerUser };
