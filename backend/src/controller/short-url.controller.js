import { createShortUrlServiceWithoutUser, createShortUrlServiceWithUser } from "../services/short-url.service.js";
import { findUrlFromShortUrl, findUrlsByUserId, incrementClicksAsync } from "../dao/short-uri.js";
import { redisClient } from "../config/redis.js";
import { rateLimiter } from "../authMiddleware/ratelimiter.middleware.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const { url, slug } = req.body;
    const userId = req.user?._id;
    let shortUrl;
    if (userId) {
      shortUrl = await createShortUrlServiceWithUser(url, userId, slug);
    } else {
      shortUrl = await createShortUrlServiceWithoutUser(url, slug);
    }
    const domain = process.env.NODE_ENV === "production"
      ? "https://url-shortener-2ufk.onrender.com/"
      : "http://localhost:3000/";
    res.status(200).send(`${domain}${shortUrl}`);
  } catch (err) {
    next(err);
  }
};

export const redirectfromShortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `url:cache:${id}`;
    const cachedLongUrl=await redisClient.get(cacheKey);
    if(cachedLongUrl){
      incrementClicksAsync(id);
      //I used setImmediate so that 
      //user will redirect instantly while the click will update asynchronously
      return res.redirect(cachedLongUrl);
    }
    const url = await findUrlFromShortUrl(id);
    if (!url) {
      return res.status(404).send("Short URL not found");
    }
    await redisClient.set(cacheKey,url.full_url,{EX: 86400});
    incrementClicksAsync(id);
    res.redirect(url.full_url);
  } catch (err) {
    next(err);
  }
};

export const getMyUrlsController = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const urls = await findUrlsByUserId(userId);
    res.status(200).json({ urls });
  } catch (err) {
    next(err);
  }
};
