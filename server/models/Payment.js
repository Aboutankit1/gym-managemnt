import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan" },
    amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Bank Transfer", "Online"],
      default: "Cash",
    },
    status: { type: String, enum: ["Paid", "Pending", "Failed", "Refunded"], default: "Paid" },
    paymentDate: { type: Date, default: Date.now },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    notes: { type: String, default: "" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

paymentSchema.pre("save", async function (next) {
  if (!this.isNew || this.invoiceNumber) return next();
  const count = await mongoose.model("Payment").countDocuments();
  const year = new Date().getFullYear();
  this.invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, "0")}`;
  next();
});

export default mongoose.model("Payment", paymentSchema);
