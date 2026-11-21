import { createShortUrlService, redirectShortUrlService } from "../services/url.service";

const createShortUrlController = async (req, res) => {
    try {
        const { originalUrl } = req.body
        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                message: "Original URL is required"
            })
        }

        const result = await createShortUrlService(originalUrl);
        return res.status(201).json({
            success: true,
            data: result
        })
    }
    catch (error) {
        console.error("Create URL server", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const redirectShortUrlController = async (req, res) => {
    try {
        const { shortCode } = req.params;
        if (!shortCode) {
            return res.status(400).json({
                success: false,
                message: "URL not found"
            })
        }
        const originalUrl = await redirectShortUrlService(shortCode);
        return res.redirect(302, originalUrl)

    } catch (error) {
        console.error("Redirect URL server", error.message);
        if (error.message === "URL_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Short URL not found"
            })
        }
        if (error.message === "URL_EXPIRED") {
            return res.status(410).json({
                success: false,
                message: "Short URL has expired"
            })
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export { createShortUrlController, redirectShortUrlController };