import express from "express";
import isAuthenticate from "../middlewares/isAuthenticate.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/comapnyController.js";

const router = express.Router();

router.route("/register").post(isAuthenticate,registerCompany);
router.route("/get").get(isAuthenticate,getCompany);
router.route("/get/:id").get(isAuthenticate,getCompanyById);
router.route("/update/:id").put(isAuthenticate,updateCompany);

export default router;