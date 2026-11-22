import { customAlphabet } from "nanoid";
import Url from "../models/url.model";
import redis from "../config/redis.js";

const generateShortCode = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7
);

const createShortUrlService = async (originalUrl) => {

    // Validate URL
    let parsedUrl;

    try {
        parsedUrl = new URL(originalUrl);
    } catch {
        throw new Error("Invalid URL")
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only HTTP and HTTPS URLs are allowed");
    }

    // Generate Short Code
    const shortCode = generateShortCode();

    // Save URL in MongoDB
    const newUrl = await Url.create({ originalUrl, shortCode });

    // Construct short URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const shortUrl = `${baseUrl}/${newUrl.shortCode}`;

    // Return response data
    return {
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl
    }
}

const redirectShortUrlService = async (shortCode) => {
    const cacheKey = `url:${shortCode}`;
    const cachedUrl = await redis.get(cacheKey);

    let originalUrl;

    if (cachedUrl) {
        // Cache HIT
        const cachedValue = JSON.parse(cachedUrl);
        if (cachedValue.expiresAt && new Date(cachedValue.expiresAt) <= new Date()) {
            throw new Error("URL_EXPIRED")
        }
        originalUrl = cachedValue.originalUrl;
    } else {
        // Cache MISS
        const findUrl = await Url.findOne({ shortCode });
        if (!findUrl) {
            throw new Error("URL_NOT_FOUND")
        }

        // Check URL expiration
        if (findUrl.expiresAt && findUrl.expiresAt <= new Date()) {
            throw new Error("URL_EXPIRED")
        }

        // Calculate TTL
        let ttl = 3600;

        if (findUrl.expiresAt) {
            const remainingTime = (findUrl.expiresAt.getTime() - Date.now()) / 1000
            if (remainingTime <= 1) {
                throw new Error("URL_EXPIRED")
            }
            if (remainingTime < ttl) {
                ttl = Math.floor(remainingTime)
            }
        }

        // Store the data in Redis
        const cachedValue = JSON.stringify({ originalUrl: findUrl.originalUrl, expiresAt: findUrl.expiresAt })
        await redis.set(cacheKey, cachedValue, "EX", ttl)

        originalUrl = findUrl.originalUrl;

    }

    // Increment the clicks count
    await Url.updateOne({ shortCode }, { $inc: { "clicks": 1 } })
    return originalUrl;
}

export { createShortUrlService, redirectShortUrlService };