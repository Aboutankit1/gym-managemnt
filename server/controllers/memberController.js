import asyncHandler from "express-async-handler";
import QRCode from "qrcode";
import Member from "../models/Member.js";
import MembershipPlan from "../models/MembershipPlan.js";

// @desc    Get members with search, filter, pagination
// @route   GET /api/members?search=&status=&plan=&page=&limit=
export const getMembers = asyncHandler(async (req, res) => {
  const { search = "", status, plan, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { memberId: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (status) filter.membershipStatus = status;
  if (plan) filter.currentPlan = plan;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const [members, total] = await Promise.all([
    Member.find(filter)
      .populate("currentPlan", "name type price")
      .populate("assignedTrainer", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Member.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: members,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @desc    Get single member
// @route   GET /api/members/:id
export const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate("currentPlan")
    .populate("assignedTrainer", "name phone")
    .populate("membershipHistory.plan", "name type");

  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  res.json({ success: true, data: member });
});

// @desc    Create member (and generate QR code)
// @route   POST /api/members
export const createMember = asyncHandler(async (req, res) => {
  const { currentPlan, membershipStartDate } = req.body;

  let membershipEndDate;
  if (currentPlan) {
    const plan = await MembershipPlan.findById(currentPlan);
    if (!plan) {
      res.status(404);
      throw new Error("Selected membership plan not found");
    }
    const start = membershipStartDate ? new Date(membershipStartDate) : new Date();
    membershipEndDate = new Date(start);
    membershipEndDate.setDate(membershipEndDate.getDate() + plan.durationInDays);
  }

  const member = new Member({
    ...req.body,
    membershipStartDate: membershipStartDate || new Date(),
    membershipEndDate,
  });

  member.membershipStatus = member.computeStatus();
  await member.save();

  // Generate QR code that encodes the member's unique ID — used for check-in & membership card
  const qrPayload = JSON.stringify({ memberId: member.memberId, id: member._id.toString() });
  member.qrCode = await QRCode.toDataURL(qrPayload);
  await member.save();

  res.status(201).json({ success: true, data: member });
});

// @desc    Update member
// @route   PUT /api/members/:id
export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  Object.assign(member, req.body);
  member.membershipStatus = member.computeStatus();
  await member.save();

  res.json({ success: true, data: member });
});

// @desc    Delete member
// @route   DELETE /api/members/:id
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  await member.deleteOne();
  res.json({ success: true, message: "Member deleted" });
});

// @desc    Renew membership for a member
// @route   POST /api/members/:id/renew
export const renewMembership = asyncHandler(async (req, res) => {
  const { planId, amountPaid } = req.body;
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }

  const plan = await MembershipPlan.findById(planId);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }

  // Extend from current end date if still active, otherwise from today
  const base =
    member.membershipEndDate && new Date(member.membershipEndDate) > new Date()
      ? new Date(member.membershipEndDate)
      : new Date();
  const newEndDate = new Date(base);
  newEndDate.setDate(newEndDate.getDate() + plan.durationInDays);

  member.membershipHistory.push({
    plan: plan._id,
    startDate: member.membershipStartDate,
    endDate: member.membershipEndDate,
    amountPaid: amountPaid || plan.price,
  });

  member.currentPlan = plan._id;
  member.membershipStartDate = member.membershipStartDate || new Date();
  member.membershipEndDate = newEndDate;
  member.membershipStatus = member.computeStatus();

  await member.save();
  res.json({ success: true, data: member });
});

// @desc    Get members with upcoming/expired memberships (for reminders & dashboard)
// @route   GET /api/members/expiry/alerts
export const getExpiryAlerts = asyncHandler(async (req, res) => {
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const expiringSoon = await Member.find({
    membershipEndDate: { $gte: today, $lte: sevenDaysFromNow },
  }).select("name memberId phone membershipEndDate");

  const expired = await Member.find({
    membershipEndDate: { $lt: today },
    membershipStatus: { $ne: "Inactive" },
  }).select("name memberId phone membershipEndDate");

  res.json({ success: true, data: { expiringSoon, expired } });
});
