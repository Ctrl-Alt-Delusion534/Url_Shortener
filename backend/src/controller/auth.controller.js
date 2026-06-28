import { register, login, checkEmail } from "../services/auth.service.js";
import { authCookieName, cookieOptions } from "../config/config.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await register(name, email, password);
    const token = signToken({ id: user._id.toString() });
    res.cookie(authCookieName, token, cookieOptions);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const LoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    const token = signToken({ id: user._id.toString() });
    res.cookie(authCookieName, token, cookieOptions);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie(authCookieName, cookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const exists = await checkEmail(email);
    res.status(200).json({ exists });
  } catch (err) {
    next(err);
  }
};
