import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!password) {
    throw new ApiError(400, "all fields are required");
  }
  if ([name, email, password].some((fields) => fields?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with given email already exists");
  }
  console.log("starts");
  const user = await User.create({
    name,
    email,
    password,
  });
  console.log("ends");
  if (!user) {
    throw new ApiError(500, "something went wrong on server");
  }
  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered sucessfully"));
});

export { registerUser };
