import express from "express";
import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getPlans)
  .post(protect, authorize("admin", "manager"), createPlan);

router.route("/:id")
  .get(protect, getPlanById)
  .put(protect, authorize("admin", "manager"), updatePlan)
  .delete(protect, authorize("admin"), deletePlan);

export default router;
