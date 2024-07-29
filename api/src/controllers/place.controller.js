import { User } from "../models/users.model.js";
import { Place } from "../models/places.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addPlaces = asyncHandler(async (req, res) => {
  res.json("ok");
});

export { addPlaces };
