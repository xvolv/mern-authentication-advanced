import { Router } from "express";
import {
  signUp,
  logIn,
  logOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/verifyToken.js";
const authRouter = Router();
authRouter.get("/check-auth", protectRoute, checkAuth);
authRouter.post("/sign-up", signUp);
authRouter.post("/log-in", logIn);
authRouter.post("/log-out", logOut);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
