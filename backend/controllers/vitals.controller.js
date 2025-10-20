import { Vitals } from "../models/vitals.model.js";

// ✅ POST /api/vital-add
export const createVitals = async (req, res) => {
  try {
    const { date, bloodPressureSystolic, bloodPressureDiastolic, heartRate, temperature, weight, notes, userId } = req.body;

    // Basic validation
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const newVitals = new Vitals({
      date,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      temperature,
      weight,
      notes,
      userId,
    });

    const savedVitals = await newVitals.save();

    res.status(201).json({
      message: "Vitals added successfully",
      data: savedVitals,
    });
  } catch (error) {
    console.error("Error creating vitals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET /api/vitals
export const getVitals = async (req, res) => {
  try {
    const { userId } = req.query; // ✅ Use query instead of body for GET
    console.log("✅ Received request for vitals with userId:", userId);

    const filter = userId ? { userId } : {};
    const vitals = await Vitals.find(filter).sort({ createdAt: -1 });

    console.log("✅ Fetched vitals:", vitals.length);
    res.status(200).json({
      message: "Vitals fetched successfully",
      count: vitals.length,
      data: vitals,
    });
  } catch (error) {
    console.error("❌ Error fetching vitals:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
};

