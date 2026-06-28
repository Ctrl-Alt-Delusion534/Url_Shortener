import  mongoose from "mongoose";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true  
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar:{
    type: String,
    //add gravatar
    default: function() {
      const hash = crypto.createHash('md5').update(this.email.trim().toLowerCase()).digest('hex');
     return `https://secure.gravatar.com/avatar/${hash}?d=identicon`;
    },
      }
});

export const User = mongoose.model("User", userSchema);
