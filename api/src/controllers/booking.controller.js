import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Booking } from "../models/bookings.model.js";
import { User } from "../models/users.model.js";

const makeNewBookings = asyncHandler(async (req, res) => {
  const { checkIn, checkOut, name, place, mobile } = req.body;
  if (!checkIn || !checkOut || !name || !place) {
    throw new ApiError(400, "All details are required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const bookingData = {
    checkIn,
    checkOut,
    name,
    place,
    mobile,
    user: user._id,
  };

  const booking = await Booking.create(bookingData);
  if (!booking) {
    throw new ApiError(500, "Internal server error creating this object");
  }

  res
    .status(200)
    .json(new ApiResponse(200, booking, "succesfully booked the trip!"));
});

const getBookingOfAUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }
  const bookings = await Booking.find({ user: user._id }).populate("place");
  if (!bookings) {
    throw new ApiError(
      500,
      "Internal server error fetching the details of bookings"
    );
  }
  res
    .status(200)
    .json(new ApiResponse(200, bookings, "bookings fetched succesfully"));
});

const getABooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }

  const { id } = req.params;
  const booking = await Booking.findById(id).populate("place");
  if (!booking) {
    throw new ApiError(
      500,
      "Internal servor error fetching the details of booking"
    );
  }
  res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking fetched succesfully"));
});

export { makeNewBookings, getBookingOfAUser, getABooking };
