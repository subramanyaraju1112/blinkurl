import dotenv from "dotenv";
import connectDB from "./config/database";
import redis from "./config/redis";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Start Server
const startServer = async () => {
    await connectDB();
    await redis.ping();
    console.log("Redis connection verified:", "PONG");

    app.listen(PORT, () => {
        console.log(`BlinkURL server is running on PORT ${PORT}`)
    })
}

startServer();