import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customeError.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
export const signUp = asyncErrorHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return next(
      new CustomError("BOTH EMAIL AND PASSWORD SHOULD BE PROVIDED", 400)
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new CustomError("USER ALREADY EXIST ", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // const verificationToken = crypto.randomBytes(10).toString("hex");
  const verificationToken =
    Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;

  const user = new User({
    email,
    name,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
  });
  await user.save();
  // create a token send a verification email
  generateTokenAndSetCookie(res, user._id);
  const { password: userPassowrd, ...clientData } = user._doc;
  res.status(201).json({
    success: true,
    message: "user created successfully",
    user: clientData,
  });
});

export const signIn = async (req, res) => {
  res.send("hello world");
};
export const signOut = async (req, res) => {
  res.send("hello world");
};
