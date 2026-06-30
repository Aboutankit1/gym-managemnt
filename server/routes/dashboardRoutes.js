import express from "express";
import {
  getSummary,
  getRevenueTrend,
  getMembershipDistribution,
  getRecentActivity,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", protect, getSummary);
router.get("/revenue-trend", protect, getRevenueTrend);
router.get("/membership-distribution", protect, getMembershipDistribution);
router.get("/recent-activity", protect, getRecentActivity);

export default router;
