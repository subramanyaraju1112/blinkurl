import { customAlphabet } from "nanoid";
import Url from "../models/url.model";

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

    const findUrl = await Url.findOne({ shortCode });
    if (!findUrl) {
        throw new Error("URL_NOT_FOUND")
    }

    // Check URL expiration
    if (findUrl.expiresAt && findUrl.expiresAt <= new Date()) {
        throw new Error("URL_EXPIRED")
    }
    // Increment the clicks count
    await Url.updateOne({ shortCode }, { $inc: { "clicks": 1 } })
    return findUrl.originalUrl;
}

export { createShortUrlService, redirectShortUrlService };