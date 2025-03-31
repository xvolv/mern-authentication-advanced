import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { NODE_ENV } from "../config/env.js";
import { CustomError } from "../utils/customeError.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { CLIENT_URL } from "../config/env.js";
import crypto from "crypto";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetSuccessEmail,
  sendPasswordResetEmail,
} from "../config/mailtrap/emails.js";

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
  await sendVerificationEmail(user.email, user.verificationToken, next);
  const { password: userPassowrd, ...clientData } = user._doc;
  res.status(201).json({
    success: true,
    message: "user created successfully",
    user: clientData,
  });
});

export const logIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("email:", email, "password:", password);
  if (!email || !password) {
    return next(
      new CustomError("BOTH EMAIL AND PASSWORD SHOULD BE PROVIDED", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("user not found", 404));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  console.log("isPasswordMatched :", isPasswordMatched);
  if (!isPasswordMatched) {
    {
      return next(new CustomError("INVALID CREDENTIALS", 400));
    }
  }
  // create a token and set it in the cookie
  generateTokenAndSetCookie(res, user._id);
  user.lastLogin = Date.now();
  await user.save();
  const { password: userPassword, ...clientData } = user._doc;
  res.status(200).json({
    success: true,
    message: "LOGGED IN SUCCESSFULLY",
    user: clientData,
  });
});

export const logOut = asyncErrorHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    success: true,
    message: "LOGGED OUT SUCCESSFULLY",
  });
});

export const verifyEmail = asyncErrorHandler(async (req, res, next) => {
  const { verificationToken } = req.body;

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    next(new CustomError("INVALID OR EXPIRED VERIFICATION TOKEN", 400));
  }
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  await sendWelcomeEmail(user.email, next);

  res.status(200).json({
    success: true,
    message: "EMAIL VERIFIED SUCCESSFULLY",
    user: {
      email: user.email,
      name: user.name,
    },
  });
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("user not found", 404));
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  const tokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresAt = tokenExpiresAt;
  await user.save();
  await sendPasswordResetEmail(
    user.email,
    `${CLIENT_URL}/reset-password/${resetToken}`
  );

  res.status(200).json({
    success: true,
    message: "password reset message  SUCCESSFULLY sent",
    user: {
      email: user.email,
      name: user.name,
    },
  });
});
export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.params;
  console.log("token:", token);

  const { password } = req.body;
  console.log("password:", password);
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });
  console.log("user:", user);

  if (!user) {
    return next(new CustomError("user not found", 404));
  }
  //update the password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordExpiresAt = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  await sendResetSuccessEmail(user.email);
  res.status(200).json({
    success: true,
    message: "password reset message  SUCCESSFULLY sent",
    user: {
      email: user.email,
      name: user.name,
    },
  });
});
export const checkAuth = asyncErrorHandler(async (req, res) => {
  res.json({
    success: true,
    message: "user is authenticated",
    user: req.user,
  });
});
