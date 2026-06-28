import {generateNanoId} from "../utils/helper.js";
import shorturl from "../models/shorturl.model.js";
import {saveShortUrl} from "../dao/short-uri.js";
export const createShortUrlServiceWithoutUser=async (url)=>{const shortUrl=generateNanoId(7);
if(!shortUrl){
    throw new Error("Failed to generate short URL");
}
await saveShortUrl(shortUrl,url);
  return shortUrl;
 }

 export const createShortUrlServiceWithUser = async (url, userId) => {
   const shortUrl = generateNanoId(7);
   await saveShortUrl(shortUrl, url,userId);
   return shortUrl;
 };
