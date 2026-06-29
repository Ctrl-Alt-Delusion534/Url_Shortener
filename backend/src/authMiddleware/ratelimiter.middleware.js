import { redisClient } from "../config/redis.js";
import { calculateRateLimitMetrics } from "../utils/helper.js";

export const rateLimiter = ({
  windowMs = 60000,
  maxRequests = 20,
  keyPrefix = "rate",
} = {}) => {
  return async (req, res, next) => {
    const clientIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    const rateLimitKey = `${keyPrefix}:${clientIp}`;
    const currentTimestamp = Date.now();
    const cacheExpirationSeconds = Math.ceil(windowMs / 1000) + 5;

    try {
      const transactionResults = await redisClient
        .multi()
        .zRemRangeByScore(rateLimitKey, 0, currentTimestamp - windowMs)
        .zCard(rateLimitKey)
        .zRange(rateLimitKey, 0, 0)
        .zAdd(rateLimitKey, {
          score: currentTimestamp,
          value: currentTimestamp.toString(),
        })
        .expire(rateLimitKey, cacheExpirationSeconds)
        .exec();

      const activeRequestCount = transactionResults[1];
      const oldestRequestTimestamp =
        transactionResults[2] && transactionResults[2][0]
          ? parseInt(transactionResults[2][0])
          : currentTimestamp;

      const { remainingRequests, rateLimitResetSeconds, retryAfterSeconds } =
        calculateRateLimitMetrics(
          activeRequestCount,
          oldestRequestTimestamp,
          maxRequests,
          windowMs,
          currentTimestamp,
        );

      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", remainingRequests);
      res.setHeader("X-RateLimit-Reset", rateLimitResetSeconds);

      if (activeRequestCount >= maxRequests) {
        res.setHeader("Retry-After", retryAfterSeconds);
        return res.status(429).json({
          message: `Too many requests. Please try again after ${retryAfterSeconds} seconds.`,
        });
      }

      next();
    } catch (err) {
      console.error("Rate Limiter Error (Failing Open):", err);
      next();
    }
  };
};
