import { User } from "../models/users.model.js";
import { Place } from "../models/places.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addPlaces = asyncHandler(async (req, res) => {
  const {
    address,
    photos,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    title,
  } = req.body;
  if (
    req.files &&
    Array.isArray(req.files.photos) &&
    req.files.photos.length > 0
  ) {
    for (let individual of req.files.photos) {
      //console.log(individual.path);
      const uploaded = await uploadOnCloudinary(individual.path);
      console.log("uploaded", uploaded.url);
    }
  }

  res.json("ok");
});

export { addPlaces };
