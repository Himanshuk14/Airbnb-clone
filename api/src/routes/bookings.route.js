import { Router } from "express";
import {
  getBookingOfAUser,
  makeNewBookings,
  getABooking,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/new").post(verifyJWT, makeNewBookings);
router.route("/getAll").get(verifyJWT, getBookingOfAUser);
router.route("/get-a-booking/:id").get(verifyJWT, getABooking);
export default router;
