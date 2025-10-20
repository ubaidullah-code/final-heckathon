import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },

  imageUrl: { type: String, required: true },
  uploadedBy: { type: String }, // userId or email
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Report =  mongoose.model("Report", ReportSchema);
