import { generateNanoId } from "../utils/helper.js";
import { createShortUrlServiceWithoutUser } from "../services/short-url.service.js";
import { createShortUrlServiceWithUser } from "../services/short-url.service.js";
import { findUrlFromShortUrl } from "../dao/short-uri.js";
export const createShortUrl = async (req, res,next) => {
  try{
    const { url } = req.body;
  const shortUrl = await createShortUrlServiceWithoutUser(url);
  res.send(process.env.APP_URL + shortUrl);
  }
  catch(err){
    next(err);
  }
};
export const redirectfromShortUrl = async (req, res) => {
    try{
  const { id } = req.params;
  const url = await findUrlFromShortUrl(id);
  if (!url) {
    throw new Error("Short URL not found");
  }
  res.redirect(url.full_url);
}catch(err){
    next(err);
}
};
export const createCustomShortUrl= async(res,req)=>{
  const {url,customUrl}=req.body
  const shortUrl=await createShortUrlServiceWithoutUser(url,customUrl);
  res.status
}
//can do many const exports but only one default export
