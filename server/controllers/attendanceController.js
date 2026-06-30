import asyncHandler from "express-async-handler";
import Attendance from "../models/Attendance.js";
import Member from "../models/Member.js";

const todayStr = () => new Date().toISOString().slice(0, 10);

// Resolve a member from either a raw memberId/_id string or a scanned QR JSON payload
const resolveMember = async (raw) => {
  let memberId;
  let mongoId;

  try {
    const parsed = JSON.parse(raw);
    memberId = parsed.memberId;
    mongoId = parsed.id;
  } catch {
    memberId = raw;
  }

  const member = mongoId
    ? await Member.findById(mongoId)
    : await Member.findOne({ memberId });

  return member;
};

// @desc    Check in a member (via QR scan or manual entry)
// @route   POST /api/attendance/check-in
// @body    { code }  -- raw QR string or memberId/phone
export const checkIn = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error("Scan code or member ID is required");
  }

  let member = await resolveMember(code);

  // Fallback: allow manual lookup by phone too
  if (!member) {
    member = await Member.findOne({ phone: code });
  }

  if (!member) {
    res.status(404);
    throw new Error("Member not found. Check the ID/QR and try again");
  }

  if (member.membershipStatus === "Expired" || member.membershipStatus === "Inactive") {
    res.status(403);
    throw new Error(`${member.name}'s membership is ${member.membershipStatus.toLowerCase()}. Renew before check-in.`);
  }

  const date = todayStr();

  const existing = await Attendance.findOne({ member: member._id, date, checkOutTime: null });
  if (existing) {
    res.status(409);
    throw new Error(`${member.name} is already checked in today`);
  }

  const record = await Attendance.create({
    member: member._id,
    date,
    checkInTime: new Date(),
    method: req.body.method || "QR Scan",
  });

  res.status(201).json({
    success: true,
    data: {
      ...record.toObject(),
      member: { _id: member._id, name: member.name, memberId: member.memberId, photo: member.photo },
    },
  });
});

// @desc    Check out a member
// @route   POST /api/attendance/check-out
// @body    { code }
export const checkOut = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const member = await resolveMember(code);

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  const record = await Attendance.findOne({
    member: member._id,
    date: todayStr(),
    checkOutTime: null,
  });

  if (!record) {
    res.status(404);
    throw new Error(`${member.name} has no active check-in today`);
  }

  record.checkOutTime = new Date();
  await record.save();

  res.json({ success: true, data: record });
});

// @desc    Today's attendance log
// @route   GET /api/attendance/today
export const getTodayAttendance = asyncHandler(async (req, res) => {
  const records = await Attendance.find({ date: todayStr() })
    .populate("member", "name memberId phone photo")
    .sort({ checkInTime: -1 });

  res.json({ success: true, count: records.length, data: records });
});

// @desc    Attendance history with filters
// @route   GET /api/attendance?member=&from=&to=&page=&limit=
export const getAttendanceHistory = asyncHandler(async (req, res) => {
  const { member, from, to, page = 1, limit = 15 } = req.query;

  const filter = {};
  if (member) filter.member = member;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) filter.date.$lte = to;
  }

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);

  const [records, total] = await Promise.all([
    Attendance.find(filter)
      .populate("member", "name memberId phone")
      .sort({ checkInTime: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Attendance.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: records,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
  });
});
