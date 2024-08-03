import { Router } from "express";
import { makeNewBookings } from "../controllers/booking.controller.js";
const router = Router();
router.route("/new").post(makeNewBookings);
export default router;
