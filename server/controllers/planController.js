import asyncHandler from "express-async-handler";
import MembershipPlan from "../models/MembershipPlan.js";

// @desc    Get all plans
// @route   GET /api/plans
export const getPlans = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const plans = await MembershipPlan.find(filter).sort({ price: 1 });
  res.json({ success: true, count: plans.length, data: plans });
});

// @desc    Get single plan
// @route   GET /api/plans/:id
export const getPlanById = asyncHandler(async (req, res) => {
  const plan = await MembershipPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  res.json({ success: true, data: plan });
});

// @desc    Create plan
// @route   POST /api/plans
export const createPlan = asyncHandler(async (req, res) => {
  const plan = await MembershipPlan.create(req.body);
  res.status(201).json({ success: true, data: plan });
});

// @desc    Update plan
// @route   PUT /api/plans/:id
export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  res.json({ success: true, data: plan });
});

// @desc    Delete plan
// @route   DELETE /api/plans/:id
export const deletePlan = asyncHandler(async (req, res) => {
  const plan = await MembershipPlan.findById(req.params.id);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  await plan.deleteOne();
  res.json({ success: true, message: "Plan deleted" });
});
