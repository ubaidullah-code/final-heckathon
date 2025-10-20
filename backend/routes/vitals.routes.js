import express from "express";
import { createVitals, getVitals } from "../controllers/vitals.controller.js";

const vitalsRouter = express.Router();

// ✅ POST - Add new vitals entry
vitalsRouter.post("/vital-add", createVitals);

// ✅ GET - Get all vitals or user-specific vitals (via query ?userId=123)
vitalsRouter.get("/get-vitals", getVitals);

export default vitalsRouter;
