import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/bookings.model.js";

const makeNewBookings = asyncHandler(async (req, res) => {
  const { checkIn, checkOut, name, place, mobile } = req.body;
  if (!checkIn || !checkOut || !name || !place) {
    throw new ApiError(400, "All details are required");
  }
  const bookingData = {
    checkIn,
    checkOut,
    name,
    place,
    mobile,
  };
  const booking = await Booking.create(bookingData);
  if (!booking) {
    throw new ApiError(500, "Internal server error creating this object");
  }

  res.json("ok");
});

export { makeNewBookings };
