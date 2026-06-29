import { generateNanoId } from "../utils/helper.js";
import { isUrlSafe } from "../utils/urlValidator.js";
import { saveShortUrl } from "../dao/short-uri.js";
import shorturl from "../models/shorturl.model.js";

export const createShortUrlServiceWithoutUser = async (url, slug) => {
  if (!isUrlSafe(url)) {
    throw new Error("Invalid or unsafe destination URL.");
  }

  let shortUrl = slug ? slug.trim() : "";
  if (shortUrl) {
    const existing = await shorturl.findOne({ short_url: shortUrl });
    if (existing) {
      throw new Error("This custom alias is already taken.");
    }
  } else {
    shortUrl = generateNanoId(7);
  }

  await saveShortUrl(shortUrl, url);
  return shortUrl;
};

export const createShortUrlServiceWithUser = async (url, userId, slug) => {
  if (!isUrlSafe(url)) {
    throw new Error("Invalid or unsafe destination URL.");
  }

  let shortUrl = slug ? slug.trim() : "";
  if (shortUrl) {
    const existing = await shorturl.findOne({ short_url: shortUrl });
    if (existing) {
      throw new Error("This custom alias is already taken.");
    }
  } else {
    shortUrl = generateNanoId(7);
  }

  await saveShortUrl(shortUrl, url, userId);
  return shortUrl;
};
