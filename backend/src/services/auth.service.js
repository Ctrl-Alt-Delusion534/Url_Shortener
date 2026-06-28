import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { signToken } from "../utils/helper.js";
export const register=async(name,email,password)=>{
    const user =await findUserByEmail({email});
    if(user){
        throw new Error("User already exists");
    }

    const newUser = await createUser({name,email,password});
    const token = await signToken({id:newUser._id,email:newUser.email});
    return token;
};
export const login=async(email,password)=>{
    const user = await findUserByEmail({email});
    if(!user || user.password !== password){
        throw new Error("Invalid Credentials");
    }
    const token = await signToken({id:user._id,email:user.email});
    return token;
}
