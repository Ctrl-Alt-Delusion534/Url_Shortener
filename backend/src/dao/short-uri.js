import shorturl from "../models/shorturl.model.js";
export const saveShortUrl=async(shortUrl,longurl,userId)=>{
    try{
    const newUrl=new shorturl ({full_url:longurl,
    short_url:shortUrl
  });
  if(userId){
    newUrl.user_id=userId;
  }
  await newUrl.save();
}catch(err){
    if(err.code===11000){
        throw new ConflictError("Short URL already exists");
    }
    throw new Error(err);
}
};
export const findUrlFromShortUrl=async(shortUrl)=>{return await shorturl.findOneAndUpdate({short_url:shortUrl},{$inc:{clicks:1}});
};
//Error Handling:
//App.js level 
//service level
//controller level
//dao level pe