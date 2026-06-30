import { findUserById } from "../dao/user.dao.js";
import { verifyToken } from "../utils/helper.js";
import { authCookieName } from "../config/config.js";
import { redisClient } from "../config/redis.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.[authCookieName];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    const decoded = verifyToken(token);
    const user = await findUserById(decoded);
    if (!user) return res.status(401).json({ message: "Unauthorised" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorised" });
  }
};
