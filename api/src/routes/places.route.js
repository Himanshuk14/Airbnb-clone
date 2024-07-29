import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addPlaces } from "../controllers/place.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/addPlaces").post(verifyJWT, addPlaces);

export default router;
