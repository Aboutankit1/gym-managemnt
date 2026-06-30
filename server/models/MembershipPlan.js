import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Annual", "Premium", "VIP"],
      required: true,
    },
    durationInDays: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    benefits: [{ type: String }],
    description: { type: String, default: "" },
    color: { type: String, default: "#6366f1" }, // accent color for plan badge/card
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("MembershipPlan", membershipPlanSchema);
