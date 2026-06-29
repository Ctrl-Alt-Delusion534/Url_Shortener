import shorturl from "../models/shorturl.model.js";

export const saveShortUrl = async (shortUrl, longurl, userId) => {
  try {
    const newUrl = new shorturl({
      full_url: longurl,
      short_url: shortUrl,
    });
    if (userId) {
      newUrl.user = userId;
    }
    await newUrl.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Short URL already exists");
    }
    throw new Error(err.message || err);
  }
};

export const findUrlFromShortUrl = async (shortUrl) => {
  return await shorturl.findOne(
    { short_url: shortUrl }
  );
};


export const incrementClicksAsync = (shortUrl) => {
  setImmediate(async () => {
    try {
      await shorturl.updateOne(
        { short_url: shortUrl },
        { $inc: { clicks: 1 } },
      );
    } catch (err) {
      console.error("Click Increment Failed", err);
    }
  });
};
export const findUrlsByUserId = async (userId) => {
  return await shorturl.find({ user: userId });
};