import { register, login, checkEmail } from "../services/auth.service.js";
import { authCookieName, refreshCookieName, cookieOptions, refreshCookieOptions } from "../config/config.js";
import { signToken, signRefreshToken, verifyRefreshToken } from "../utils/helper.js";
import { findUserById } from "../dao/user.dao.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await register(name, email, password);
    const accessToken = signToken({ id: user._id.toString() });
    const refreshToken = signRefreshToken({ id: user._id.toString() });
    res.cookie(authCookieName, accessToken, cookieOptions);
    res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const LoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    const accessToken = signToken({ id: user._id.toString() });
    const refreshToken = signRefreshToken({ id: user._id.toString() });
    res.cookie(authCookieName, accessToken, cookieOptions);
    res.cookie(refreshCookieName, refreshToken, refreshCookieOptions);
    res.status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie(authCookieName, cookieOptions);
    res.clearCookie(refreshCookieName, refreshCookieOptions);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[refreshCookieName];
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = verifyRefreshToken(refreshToken);
    const user = await findUserById(decoded);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token session" });
    }
    const accessToken = signToken({ id: user._id.toString() });
    res.cookie(authCookieName, accessToken, cookieOptions);
    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (err) {
    res.status(401).json({ message: "Session expired, please login again" });
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
