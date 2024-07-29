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

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "something went wrong on server");
  }
  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  const isCorrect = await user.isPasswordCorrect(password);

  if (!isCorrect) {
    throw new ApiError(403, "password is incorrect");
  }

  const { acessToken, refreshToken } = await getAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", acessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          acessToken,
          refreshToken,
        },
        "User Logged in succesfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("acessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout out"));
});

export { registerUser, loginUser, logoutUser };
