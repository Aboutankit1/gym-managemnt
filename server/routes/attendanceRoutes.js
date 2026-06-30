import express from "express";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);
router.get("/today", protect, getTodayAttendance);
router.get("/", protect, getAttendanceHistory);

export default router;
