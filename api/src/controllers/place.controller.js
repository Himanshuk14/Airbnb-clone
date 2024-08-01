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
    addedPhotos,
    coverImage,
    title,
    description,
  } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const placeData = {
    owner: user._id,
    photos: addedPhotos,
    coverImage,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    title,
    address,
    description,
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

const uploadCoverImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
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

  res
    .status(201)
    .json(
      new ApiResponse(201, coverImageUrl, "CoverImage uploaded succesfully")
    );
});

const uploadPhotos = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
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
  res
    .status(201)
    .json(new ApiResponse(201, urlArray, "sucessfully uploaded all photos"));
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

  place.photos[index] = oldCoverImageUrl;
  await place.save();

  const updatedCoverImage = await Place.findByIdAndUpdate(
    id,
    {
      $set: {
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
    "-checkIn -checkOut -maxGuests -title -extraInfo -description -coverImage -address -price -perks -owner"
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
    description,
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
        description,
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

const getAllPlaces = asyncHandler(async (req, res) => {
  const placeDoc = await Place.find();
  if (!placeDoc) {
    throw new ApiError(400, "No place document to show");
  }
  res
    .status(200)
    .json(new ApiResponse(200, placeDoc, "all places fetched succesfully"));
});
const getAllPlacesOfAUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const rel = user._id.toString();

  const allPlaces = await Place.find({ owner: rel });
  if (!allPlaces) {
    throw new ApiError(
      500,
      "Something went wrong on server in fectching all places of this logged in user"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allPlaces,
        "All places of this user fetched sucessfully "
      )
    );
});

const getAplace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (!place) {
    throw new ApiError(
      500,
      "Internal server error fectching the details of the page"
    );
  }
  res
    .status(200)
    .json(new ApiResponse(200, place, "Place details fetched succesfully"));
});

export {
  addPlaces,
  updateCoverImage,
  addPhotos,
  deletePhoto,
  updatePlace,
  getAllPlaces,
  getAllPlacesOfAUser,
  getAplace,
  uploadCoverImage,
  uploadPhotos,
};
