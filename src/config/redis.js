import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
})

redis.on("connect", () => {
    console.log("Redis connection established")
})

redis.on("ready", () => {
    console.log("Redis is ready to accept commands");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error.message);
});

redis.on("close", () => {
    console.log("Redis connection closed");
});

export default redis;
