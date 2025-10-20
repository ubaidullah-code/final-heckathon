// routes/gemini.route.js  (OR openai.routes.js if that's the source of the error)
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'

const geminiRouter = express.Router();

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Add a test route to list models
geminiRouter.get("/list-models", async (req, res) => {
    try {
        console.log("Attempting to list models with API Key:", process.env.GEMINI_API_KEY ? "Loaded" : "NOT LOADED");
        const { models } = await genAI.listModels();
        const availableModelNames = models.map(m => m.name);
        console.log("Available Gemini Models:", availableModelNames);
        res.json({ availableModels: availableModelNames });
    } catch (error) {
        console.error("Error listing Gemini models:", error);
        res.status(500).json({ error: "Failed to list Gemini models", details: error.message });
    }
});


// ✅ POST /api/gemini/chat
geminiRouter.post("/chat", async (req, res) => {
    const { message } = req.body;
    console.log("message", message);
 try {
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Ensure this model name exactly matches one from your list-models output
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Still try gemini-pro first
    const result = await model.generateContent(message);
    const response = await result.response.text();

    res.json({ response: response });
  } catch (error) {
    console.error("Gemini API Error in chat route:", error); // Specific log for chat route
    if (error.response && error.response.status) {
        return res.status(error.response.status).json({
            error: `Gemini API Error: ${error.response.statusText}`,
            details: error.response.data
        });
    }
    res.status(500).json({ error: "Failed to connect to Gemini API" });
  }
});

export default geminiRouter;