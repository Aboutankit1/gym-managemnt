import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    date: { type: String, required: true }, // YYYY-MM-DD for easy daily queries
    method: { type: String, enum: ["QR Scan", "Manual", "Card"], default: "QR Scan" },
  },
  { timestamps: true }
);

attendanceSchema.index({ member: 1, date: 1 });

export default mongoose.model("Attendance", attendanceSchema);
