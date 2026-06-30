import express from "express";
import {
  getPayments,
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  generateInvoice,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getPayments)
  .post(protect, authorize("admin", "manager", "staff"), createPayment);

router.route("/:id")
  .get(protect, getPaymentById)
  .put(protect, authorize("admin", "manager"), updatePayment)
  .delete(protect, authorize("admin"), deletePayment);

router.get("/:id/invoice", protect, generateInvoice);

export default router;
