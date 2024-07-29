import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  getUser,
} from "../controllers/user.controller.js";
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/reset-password").post(verifyJWT, changeCurrentPassword);
router.route("/refresh-acessToken").post(refreshAccessToken);
router.route("/getUser").get(verifyJWT, getUser);
export default router;
