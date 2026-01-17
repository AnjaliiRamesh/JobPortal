import express from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import isAuthenticate from "../middlewares/isAuthenticate.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticate,updateProfile);

export default router;