import express from "express";
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  renewMembership,
  getExpiryAlerts,
} from "../controllers/memberController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/expiry/alerts", protect, getExpiryAlerts);

router.route("/")
  .get(protect, getMembers)
  .post(protect, authorize("admin", "manager", "staff"), createMember);

router.route("/:id")
  .get(protect, getMemberById)
  .put(protect, authorize("admin", "manager", "staff"), updateMember)
  .delete(protect, authorize("admin", "manager"), deleteMember);

router.post("/:id/renew", protect, authorize("admin", "manager", "staff"), renewMembership);

export default router;
