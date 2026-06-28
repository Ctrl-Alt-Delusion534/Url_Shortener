import { generateNanoId } from "../utils/helper.js";
import { saveShortUrl } from "../dao/short-uri.js";
import shorturl from "../models/shorturl.model.js";

export const createShortUrlServiceWithoutUser = async (url, slug) => {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error("Invalid destination URL. Must be a valid HTTP or HTTPS address.");
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
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error();
    }
  } catch {
    throw new Error("Invalid destination URL. Must be a valid HTTP or HTTPS address.");
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
