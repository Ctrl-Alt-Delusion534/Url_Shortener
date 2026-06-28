import { createUser, findUserByEmail } from "../dao/user.dao.js";
import bcrypt from "bcrypt";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (name, email, password) => {
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const user = await findUserByEmail({ email });
  if (user) {
    throw new Error("User already exists");
  }

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ name, email, password: hashedPassword });
  return newUser;
};

export const login = async (email, password) => {
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const user = await findUserByEmail({ email });
  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return user;
};

export const checkEmail = async (email) => {
  const user = await findUserByEmail({ email: email.toLowerCase() });
  return !!user;
};
