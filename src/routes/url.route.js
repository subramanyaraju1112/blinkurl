import { Router } from "express";
import createShortUrlController from "../controllers/url.controller";

const router = Router();

router.post("/", createShortUrlController);

export default router;