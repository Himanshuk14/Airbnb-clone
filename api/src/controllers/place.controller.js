import { User } from "../models/users.model.js";
import { Place } from "../models/places.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addPlaces = asyncHandler(async (req, res) => {
  const {
    address,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    title,
  } = req.body;

  let urlArray = [];

  if (
    req.files &&
    Array.isArray(req.files.photos) &&
    req.files.photos.length > 0
  ) {
    for (let individual of req.files.photos) {
      //console.log(individual.path);
      const uploaded = await uploadOnCloudinary(individual.path);
      urlArray.push(uploaded.url);
      //console.log("uploaded", uploaded.url);
    }
  }
  let coverImageUrl = "";
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    const coverImageFilePath = req.files.coverImage[0].path;
    const uploaded = await uploadOnCloudinary(coverImageFilePath);
    coverImageUrl = uploaded.url;
  }
  //   console.log("urlArray", urlArray);
  //   console.log("ccoverImageURL", coverImageUrl);
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const placeData = {
    owner: user._id,
    photos: urlArray,
    coverImage: coverImageUrl,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    title,
    address,
  };
  const placeDoc = await Place.create(placeData);
  if (!placeDoc) {
    throw new ApiError(
      500,
      "Something went wrong in saving the place document"
    );
  }

  res
    .status(201)
    .json(new ApiResponse(201, placeDoc, "Place document saved to database"));
});

export { addPlaces };
