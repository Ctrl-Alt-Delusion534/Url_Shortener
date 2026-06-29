import jsonwebtoken from "jsonwebtoken";
import { nanoid } from "nanoid";

export const generateNanoId = (length) => {
  return nanoid(length);
};

export const signToken = (payload) => {
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

export const verifyToken = (token) => {
  return jsonwebtoken.verify(token, process.env.JWT_SECRET);
};

export const signRefreshToken = (payload) => {
  return jsonwebtoken.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token) => {
  return jsonwebtoken.verify(token, process.env.REFRESH_SECRET);
};

export const calculateRateLimitMetrics = (
  activeRequestCount,
  oldestRequestTimestamp,
  maxRequests,
  windowMs,
  currentTimestamp,
) => {
  const remainingRequests = Math.max(0, maxRequests - activeRequestCount);
  const rateLimitResetSeconds = Math.ceil(
    (oldestRequestTimestamp + windowMs) / 1000,
  );
  const retryAfterSeconds = Math.ceil(
    (oldestRequestTimestamp + windowMs - currentTimestamp) / 1000,
  );
  return { remainingRequests, rateLimitResetSeconds, retryAfterSeconds };
};