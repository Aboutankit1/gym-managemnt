import asyncHandler from "express-async-handler";
import Trainer from "../models/Trainer.js";

export const getTrainers = asyncHandler(async (req, res) => {
  const trainers = await Trainer.find().sort({ createdAt: -1 });
  res.json({ success: true, count: trainers.length, data: trainers });
});

export const getTrainerById = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer not found");
  }
  res.json({ success: true, data: trainer });
});

export const createTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.create(req.body);
  res.status(201).json({ success: true, data: trainer });
});

export const updateTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer not found");
  }
  res.json({ success: true, data: trainer });
});

export const deleteTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error("Trainer not found");
  }
  await trainer.deleteOne();
  res.json({ success: true, message: "Trainer deleted" });
});
