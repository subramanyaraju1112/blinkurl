import { Router } from "express";
import { createShortUrlController, redirectShortUrlController } from "../controllers/url.controller";

const router = Router();

router.post("/", createShortUrlController);
router.get("/:shortCode", redirectShortUrlController);

export default router;