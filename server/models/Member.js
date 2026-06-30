import mongoose from "mongoose";

const membershipHistorySchema = new mongoose.Schema(
  {
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan" },
    startDate: { type: Date },
    endDate: { type: Date },
    amountPaid: { type: Number },
    renewedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    memberId: { type: String, unique: true }, // e.g. GYM-0001
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: Date },
    address: { type: String, default: "" },
    photo: { type: String, default: "" },
    qrCode: { type: String, default: "" }, // data URL / hosted image of QR

    emergencyContactName: { type: String, default: "" },
    emergencyContactPhone: { type: String, default: "" },

    assignedTrainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },

    currentPlan: { type: mongoose.Schema.Types.ObjectId, ref: "MembershipPlan" },
    membershipStartDate: { type: Date },
    membershipEndDate: { type: Date },
    membershipStatus: {
      type: String,
      enum: ["Active", "Expired", "Expiring Soon", "Inactive"],
      default: "Inactive",
    },
    membershipHistory: [membershipHistorySchema],

    isActive: { type: Boolean, default: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-generate sequential memberId like GYM-0001
memberSchema.pre("save", async function (next) {
  if (!this.isNew || this.memberId) return next();
  const count = await mongoose.model("Member").countDocuments();
  this.memberId = `GYM-${String(count + 1).padStart(4, "0")}`;
  next();
});

// Keep membershipStatus in sync with dates whenever fetched/saved
memberSchema.methods.computeStatus = function () {
  if (!this.membershipEndDate) return "Inactive";
  const now = new Date();
  const end = new Date(this.membershipEndDate);
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return "Expired";
  if (daysLeft <= 7) return "Expiring Soon";
  return "Active";
};

export default mongoose.model("Member", memberSchema);
