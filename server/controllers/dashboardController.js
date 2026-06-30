import asyncHandler from "express-async-handler";
import Member from "../models/Member.js";
import Trainer from "../models/Trainer.js";
import Payment from "../models/Payment.js";
import Attendance from "../models/Attendance.js";

// @desc    Get summary stat cards
// @route   GET /api/dashboard/summary
export const getSummary = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const todayStr = today.toISOString().slice(0, 10);

  const [
    totalMembers,
    activeMembers,
    expiredMembers,
    expiringSoon,
    totalTrainers,
    revenueAgg,
    pendingPaymentsCount,
    todayAttendance,
  ] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({ membershipStatus: "Active" }),
    Member.countDocuments({ membershipStatus: "Expired" }),
    Member.countDocuments({ membershipStatus: "Expiring Soon" }),
    Trainer.countDocuments({ isActive: true }),
    Payment.aggregate([
      { $match: { status: "Paid", paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Payment.countDocuments({ status: "Pending" }),
    Attendance.countDocuments({ date: todayStr }),
  ]);

  res.json({
    success: true,
    data: {
      totalMembers,
      activeMembers,
      expiredMembers,
      expiringSoon,
      totalTrainers,
      monthlyRevenue: revenueAgg[0]?.total || 0,
      pendingPayments: pendingPaymentsCount,
      todayAttendance,
    },
  });
});

// @desc    Revenue trend for last 6 months (for charts)
// @route   GET /api/dashboard/revenue-trend
export const getRevenueTrend = asyncHandler(async (req, res) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const results = await Promise.all(
    months.map(async ({ year, month }) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      const agg = await Payment.aggregate([
        { $match: { status: "Paid", paymentDate: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      return {
        label: start.toLocaleString("default", { month: "short" }),
        revenue: agg[0]?.total || 0,
      };
    })
  );

  res.json({ success: true, data: results });
});

// @desc    Membership distribution by plan type (for pie chart)
// @route   GET /api/dashboard/membership-distribution
export const getMembershipDistribution = asyncHandler(async (req, res) => {
  const result = await Member.aggregate([
    { $match: { currentPlan: { $ne: null } } },
    {
      $lookup: {
        from: "membershipplans",
        localField: "currentPlan",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
    { $group: { _id: "$plan.type", count: { $sum: 1 } } },
    { $project: { type: "$_id", count: 1, _id: 0 } },
  ]);

  res.json({ success: true, data: result });
});

// @desc    Recent activity feed (latest members + payments)
// @route   GET /api/dashboard/recent-activity
export const getRecentActivity = asyncHandler(async (req, res) => {
  const [recentMembers, recentPayments] = await Promise.all([
    Member.find().sort({ createdAt: -1 }).limit(5).select("name memberId createdAt"),
    Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("member", "name memberId")
      .select("totalAmount status createdAt member"),
  ]);

  const activity = [
    ...recentMembers.map((m) => ({
      type: "New Member",
      message: `${m.name} (${m.memberId}) joined the gym`,
      timestamp: m.createdAt,
    })),
    ...recentPayments.map((p) => ({
      type: "Payment",
      message: `${p.member?.name || "A member"} paid ${p.totalAmount} (${p.status})`,
      timestamp: p.createdAt,
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({ success: true, data: activity.slice(0, 10) });
});
