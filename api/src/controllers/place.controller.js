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
      const uploaded = await uploadOnCloudinary(individual.path);
      urlArray.push(uploaded.url);
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

const updateCoverImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldCoverImageUrl, newCoverImageURL, index } = req.body;

  const user = User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const place = await Place.findById(id);

  if (!place) {
    throw new ApiError(400, "something went wrong");
  }

  place.photos.splice(index, 1, oldCoverImageUrl);

  const updatedCoverImage = await Place.findByIdAndUpdate(
    id,
    {
      $set: {
        photos: place.photos,
        coverImage: newCoverImageURL,
      },
    },
    {
      new: true,
    }
  ).select(
    "-owner -title -address  -perks -checkIn -checkOut -maxGuests -extraInfo "
  );
  if (!updatedCoverImage) {
    throw new ApiError(
      500,
      "Something went wrong on server side while updating"
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, updatedCoverImage, "CoverImage updated succesfully")
    );
});

const addPhotos = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const { id } = req.params;

  const place = await Place.findById(id);
  if (!place) {
    throw new ApiError(
      400,
      "There has to be place inorder to add photos to it"
    );
  }

  let urlArray = [];

  if (
    req.files &&
    Array.isArray(req.files.photos) &&
    req.files.photos.length > 0
  ) {
    for (let individual of req.files.photos) {
      const uploaded = await uploadOnCloudinary(individual.path);
      urlArray.push(uploaded.url);
    }
  }
  let resultantArray = urlArray;
  if (place.photos.length != 0) {
    resultantArray = resultantArray.concat(place.photos);
  }

  const updatedPlace = await Place.findByIdAndUpdate(
    id,
    {
      $set: {
        photos: resultantArray,
      },
    },
    { new: true }
  ).select(
    "-checkIn -checkOut -maxGuests -title -extraInfo -description -coverImage"
  );
  if (!updatedPlace) {
    throw new ApiError(500, "Internal server error while adding photos");
  }
  res
    .status(201)
    .json(new ApiResponse(201, updatedPlace, "Photos added succesfully "));
});

const deletePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, " Unauthorized request");
  }

  const { id } = req.params;
  const { photoId } = req.body;
  const place = await Place.findById(id);
  if (!place) {
    throw new ApiError(401, " Unauthorized request");
  }

  const updatedArray = [];
  let count = 0;
  for (let individual of place.photos) {
    if (count != photoId) {
      updatedArray.push(individual);
    }
    count++;
  }

  const updatedPlace = await Place.findByIdAndUpdate(
    id,
    {
      $set: {
        photos: updatedArray,
      },
    },
    {
      new: true,
    }
  ).select(
    "-owner -title -address  -perks -checkIn -checkOut -maxGuests -extraInfo -coverImage -price"
  );
  if (!updatedPlace) {
    throw new ApiError(500, "Interbal sever error while deleting the photo");
  }
  res
    .status(201)
    .json(new ApiResponse(201, updatedPlace, "Sucessfully deleted the photo"));
});

const updatePlace = asyncHandler(async (req, res) => {
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
  const { id } = req.params;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }

  const place = await Place.findById(id);
  if (!place) {
    throw new ApiError(401, "No place found for updation");
  }

  const updatedPlace = await Place.findByIdAndUpdate(
    id,
    {
      $set: {
        address,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
        title,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlace) {
    throw new ApiError(500, "Internal server error while updating the place");
  }

  res
    .status(201)
    .json(new ApiResponse(201, updatedPlace, "Place updated succesfully"));
});
export { addPlaces, updateCoverImage, addPhotos, deletePhoto, updatePlace };
