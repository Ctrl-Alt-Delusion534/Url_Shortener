import { createShortUrlServiceWithoutUser, createShortUrlServiceWithUser } from "../services/short-url.service.js";
import { findUrlFromShortUrl, findUrlsByUserId, incrementClicksAsync } from "../dao/short-uri.js";
import { redisClient } from "../config/redis.js";
import { getRedirectTemplate } from "../utils/redirectTemplate.js";
import { incrementCacheHits, incrementCacheMisses } from "../utils/metrics.js";

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
    let destinationUrl = await redisClient.get(cacheKey);

    if (!destinationUrl) {
      const url = await findUrlFromShortUrl(id);
      if (!url) {
        return res.status(404).send("Short URL not found");
      }
      destinationUrl = url.full_url;
      await redisClient.set(cacheKey, destinationUrl, { EX: 86400 });
      incrementCacheMisses();
    } else {
      incrementCacheHits();
    }

    incrementClicksAsync(id);
    return res.status(200).send(getRedirectTemplate(destinationUrl));
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
