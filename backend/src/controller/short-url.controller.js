import { createShortUrlServiceWithoutUser, createShortUrlServiceWithUser } from "../services/short-url.service.js";
import { findUrlFromShortUrl, findUrlsByUserId } from "../dao/short-uri.js";

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
    const url = await findUrlFromShortUrl(id);
    if (!url) {
      return res.status(404).send("Short URL not found");
    }
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
