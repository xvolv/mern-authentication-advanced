import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  verifyEmail,
} from "../controllers/auth.controller.js";
const authRouter = Router();
authRouter.post("/sign-up", signUp);
authRouter.get("/sign-in", signIn);
authRouter.get("/sign-out", signOut);
authRouter.post("/verify-email", verifyEmail);
export default authRouter;
