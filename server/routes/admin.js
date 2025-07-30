import express from "express";
import * as adminController from "../controller/adminController.js";

const router = express.Router();

router.post("/signupAdmin", adminController.signupAdmin);

router.post("/loginAdmin", adminController.loginAdmin);

export default router;
