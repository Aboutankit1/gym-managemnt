import express from "express";
import {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} from "../controllers/trainerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getTrainers)
  .post(protect, authorize("admin", "manager"), createTrainer);

router.route("/:id")
  .get(protect, getTrainerById)
  .put(protect, authorize("admin", "manager"), updateTrainer)
  .delete(protect, authorize("admin"), deleteTrainer);

export default router;
