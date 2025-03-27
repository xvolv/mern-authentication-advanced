import express from "express";
import connectToDatabase from "./mongodb/mongodb.js";
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";
import { PORT } from "./config/env.js";
import { globalErrorHandler } from "../middlewares/error.middleware.js";
const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use(globalErrorHandler);
app.listen(PORT||5500, async () => {
  console.log(`http://localhost/${PORT}`);
  try {
    await connectToDatabase();
    const databaseName = mongoose.connection.name;
    console.log("CONNECTED TO DATABASE :", databaseName);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
