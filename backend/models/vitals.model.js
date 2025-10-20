import mongoose from "mongoose";

const VitalsSchema = new mongoose.Schema(
  {
    bloodPressureSystolic: {
      type: Number,
      min: 50,
      max: 250,
      required: false,
    },
    bloodPressureDiastolic: {
      type: Number,
      min: 30,
      max: 150,
      required: false,
    },
    heartRate: {
      type: Number,
      min: 30,
      max: 250,
      required: false,
    },
    temperature: {
      type: Number,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export const Vitals = mongoose.model("Vitals", VitalsSchema);
