import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addPhotos,
  addPlaces,
  updateCoverImage,
} from "../controllers/place.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/addPlaces").post(
  verifyJWT,
  upload.fields([
    {
      name: "photos",
      maxCount: 12,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  addPlaces
);

router
  .route("/update-coverImage/:id")
  .post(
    verifyJWT,
    upload.fields([{ name: "coverImage", maxCount: 1 }]),
    updateCoverImage
  );

router.route("/add-photos/:id").post(
  verifyJWT,
  upload.fields([
    {
      name: "photos",
      maxCount: 8,
    },
  ]),
  addPhotos
);

export default router;
