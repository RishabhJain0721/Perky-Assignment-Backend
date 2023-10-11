import express from "express";
import { sendOtp } from "../controllers/otpController.js";
import { verifyOtp } from "../controllers/otpController.js";
import search from "../controllers/searchController.js";

const router = express.Router();

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/search", search);

export default router;
