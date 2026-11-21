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

export default createShortUrlController;