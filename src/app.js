import express from "express";
import UrlRoutes from "./routes/url.route"

const app = express();

// Middleware
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "BlinkURL API is running"
    })
})

// URL Routes
app.use("/api/v1/urls", UrlRoutes);

export default app;