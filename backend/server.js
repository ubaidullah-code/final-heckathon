import express from "express";
import cors from "cors"
import 'dotenv/config'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import vitalsRouter from "./routes/vitals.routes.js";
import reportRoutes from "./routes/report.routes.js";
import geminiRouter from "./routes/openai.routes.js";


const app = express()
const PORT = process.env.PORT || 5004;

app.use(cookieParser())
app.use(express.json())
app.use(cors( {origin : process.env.FRONTEND_URL, credentials: true}))

mongoose.connect(process.env.DATA_BASE_URI)
mongoose.connection.on("connected", () => { console.log("mongo db is connected") });
mongoose.connection.on("error", () => { console.log("mongo db is not connected") });


app.get(("/"), (req, res) => {
    res.send("hello world")
})
app.use('/api/auth', userRouter)
app.use("/api", vitalsRouter); 
app.use("/api/reports", reportRoutes);
app.use("/api/gemini", geminiRouter);


app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`)
})