import { register } from "../services/auth.service.js";
import { authCookieName, cookieOptions } from "../config/config.js";
import { login } from "../services/auth.service.js";
export const registerUser = async (req, res,next) => {
    const { name, email, password } = req.body;
    const token=await register(name,email,password);
    res.cookie(authCookieName, token, cookieOptions);
    res.status(201).json({message:"User registered successfully"});
};
export const LoginUser= async (req,res,next)=>{
    const {email,password}=req.body;
    const token=await login(email,password);
    res.cookie(authCookieName, token, cookieOptions);
    res.status(200).json({message:"User logged in successfully"});
}
