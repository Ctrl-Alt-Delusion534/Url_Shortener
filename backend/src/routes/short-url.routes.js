import express from "express";
import { 
  createShortUrl, 
  getMyUrlsController 
} from "../controller/short-url.controller.js";
import { authMiddleware } from "../authMiddleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createShortUrl);
router.get("/my-urls", authMiddleware, getMyUrlsController);

export default router;
