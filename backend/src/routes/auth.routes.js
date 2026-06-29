import express from "express";
import { 
  registerUser, 
  LoginUser, 
  logoutUser, 
  checkEmailExists,
  refreshSession
} from "../controller/auth.controller.js";
import { authMiddleware } from "../authMiddleware/auth.middleware.js";
import { rateLimiter } from "../authMiddleware/ratelimiter.middleware.js";
const router = express.Router();

const authRateLimit = rateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5,
  keyPrefix: "auth_limit",
});

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshSession);
router.get("/check-email", checkEmailExists);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
