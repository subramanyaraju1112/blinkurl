import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "BlinkURL API is running"
    })
})

// Start Server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`BlinkURL server is running on PORT ${PORT}`)
    })
}

startServer();