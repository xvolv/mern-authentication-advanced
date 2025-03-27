import mongoose from "mongoose";
import { DATABASE_URL } from "./../config/env.js";

const connectToDatabase = async () => {
  await mongoose.connect(DATABASE_URL);
};
export default connectToDatabase;
