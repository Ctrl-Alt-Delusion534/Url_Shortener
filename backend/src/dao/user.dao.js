import { User } from "../models/user_models.js";

export const findUserByEmail = async ({email}) => {
    const user = await User.findOne({ email });
    return user;
}
export const findUserById = async ({id}) => {
    const user = await User.findById(id);
    return user;
};
export const createUser = async ({name, email, password}) => {
    const newUser = new User({ name, email, password });
    await newUser.save();
    return newUser;
};
