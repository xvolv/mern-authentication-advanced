import { Router } from "express";
import { signUp,signIn,signOut } from "../controllers/auth.controller.js";
const authRouter = Router();
authRouter.post("/sign-up", signUp);
authRouter.get("/sign-in", signIn);
authRouter.get("/sign-out", signOut);
export default authRouter;
