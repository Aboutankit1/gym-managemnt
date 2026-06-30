import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";
import Payment from "../models/Payment.js";
import Member from "../models/Member.js";

// @desc    Get all payments (with filters)
// @route   GET /api/payments?member=&status=&page=&limit=
export const getPayments = asyncHandler(async (req, res) => {
  const { member, status, page = 1, limit = 10, from, to } = req.query;

  const filter = {};
  if (member) filter.member = member;
  if (status) filter.status = status;
  if (from || to) {
    filter.paymentDate = {};
    if (from) filter.paymentDate.$gte = new Date(from);
    if (to) filter.paymentDate.$lte = new Date(to);
  }

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("member", "name memberId phone")
      .populate("plan", "name type")
      .sort({ paymentDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Payment.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: payments,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
  });
});

// @desc    Create a payment record (collect fee)
// @route   POST /api/payments
export const createPayment = asyncHandler(async (req, res) => {
  const { member, amount, discount = 0, tax = 0 } = req.body;

  const memberDoc = await Member.findById(member);
  if (!memberDoc) {
    res.status(404);
    throw new Error("Member not found");
  }

  const totalAmount = Number(amount) - Number(discount) + Number(tax);

  const payment = await Payment.create({
    ...req.body,
    totalAmount,
    recordedBy: req.user?._id,
  });

  res.status(201).json({ success: true, data: payment });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("member", "name memberId phone email address")
    .populate("plan", "name type price");

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  res.json({ success: true, data: payment });
});

// @desc    Update payment status
// @route   PUT /api/payments/:id
export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  res.json({ success: true, data: payment });
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  await payment.deleteOne();
  res.json({ success: true, message: "Payment deleted" });
});

// @desc    Generate & stream a PDF invoice for a payment
// @route   GET /api/payments/:id/invoice
export const generateInvoice = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("member", "name memberId phone email address")
    .populate("plan", "name type");

  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${payment.invoiceNumber}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text("INVOICE", { align: "right" });
  doc.fontSize(10).text(`Invoice #: ${payment.invoiceNumber}`, { align: "right" });
  doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, { align: "right" });
  doc.moveDown(2);

  doc.fontSize(14).text("Billed To:");
  doc.fontSize(11).text(payment.member?.name || "N/A");
  doc.text(payment.member?.memberId || "");
  doc.text(payment.member?.phone || "");
  doc.text(payment.member?.email || "");
  doc.moveDown(2);

  doc.fontSize(12).text(`Plan: ${payment.plan?.name || "N/A"} (${payment.plan?.type || ""})`);
  doc.text(`Payment Method: ${payment.paymentMethod}`);
  doc.text(`Status: ${payment.status}`);
  doc.moveDown();

  doc.text(`Amount: ${payment.amount.toFixed(2)}`);
  doc.text(`Discount: ${payment.discount.toFixed(2)}`);
  doc.text(`Tax: ${payment.tax.toFixed(2)}`);
  doc.fontSize(14).text(`Total: ${payment.totalAmount.toFixed(2)}`, { underline: true });

  doc.moveDown(2);
  doc.fontSize(9).fillColor("gray").text("Thank you for your membership!", { align: "center" });

  doc.end();
});
