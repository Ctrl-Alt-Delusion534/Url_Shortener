import express from "express";
import { 
  registerUser, 
  LoginUser, 
  logoutUser, 
  checkEmailExists
} from "../controller/auth.controller.js";
import { authMiddleware } from "../authMiddleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/logout", logoutUser);
router.get("/check-email", checkEmailExists);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
