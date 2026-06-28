import mongoose from "mongoose";
const shortUrlSchema = new mongoose.Schema({
    full_url:{
        type:String,
        required:true,
    },
    short_url:{
        type:String,
        required:true,
        index:true,//indexing for faster read
        unique:true,
    },
    clicks:{
        type:Number,
        required:true,
        default:0,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});
const shorturl=mongoose.model("shorturl",shortUrlSchema);
export default shorturl;