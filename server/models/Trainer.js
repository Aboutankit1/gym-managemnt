import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true },
    photo: { type: String, default: "" },
    specialization: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    salary: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", trainerSchema);
