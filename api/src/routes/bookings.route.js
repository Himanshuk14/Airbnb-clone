import { Router } from "express";
import {
  getBookingOfAUser,
  makeNewBookings,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/new").post(verifyJWT, makeNewBookings);
router.route("/getAll").get(verifyJWT, getBookingOfAUser);
export default router;
