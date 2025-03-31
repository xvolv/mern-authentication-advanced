import jwt from "jsonwebtoken";
import { CustomError } from "../utils/customeError.js";
import { JWT_SECRET } from "./../config/env.js";
import User from "../models/user.model.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

export const protectRoute = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new CustomError("Token not found", 401));
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  const { userId } = decoded;

  const user = await User.findById(userId).select(
    "-password -__v -createdAt -updatedAt"
  );

  if (!user) {
    return next(new CustomError("User not found", 401));
  }

  req.user = user;
  next();
});
