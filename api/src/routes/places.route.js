import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addPlaces } from "../controllers/place.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/addPlaces").post(
  verifyJWT,
  upload.fields([
    {
      name: "photos",
      maxCount: 8,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  addPlaces
);

export default router;
