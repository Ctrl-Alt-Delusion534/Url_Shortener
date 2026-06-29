import express from "express";
import { 
  createShortUrl, 
  getMyUrlsController 
} from "../controller/short-url.controller.js";
import { authMiddleware } from "../authMiddleware/auth.middleware.js";
import { rateLimiter } from "../authMiddleware/ratelimiter.middleware.js";

const router = express.Router();
const authRateLimit = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 15,
  keyPrefix: "short_limit",
});

router.post("/", authMiddleware, createShortUrl);
router.get("/my-urls", authMiddleware, getMyUrlsController);

export default router;
