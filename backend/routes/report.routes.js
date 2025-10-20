import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Report } from "../models/report.model.js";


const reportRoutes = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage

// ✅ POST - Upload image to Cloudinary and save URL in MongoDB
reportRoutes.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "healthmate_reports",
    });

    // Save record in MongoDB
    const report = new Report({
      title: req.body.title,
      
      imageUrl: result.secure_url,
      uploadedBy: req.body.uploadedBy || "anonymous",
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// ✅ GET - Fetch all reports (optional filter by user)
reportRoutes.get("/get-report", async (req, res) => {
  try {
    const { uploadedBy } = req.query;
    const query = uploadedBy ? { uploadedBy } : {};
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default reportRoutes;
