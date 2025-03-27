import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "EMAIL IS A REQUIRED FILLED "],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "PASSWORD IS A REQUIRED FILLED"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name IS A REQUIRED FILLED "],
      trim: true,
      unique: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },

  { timeseries: true }
);

const User = mongoose.model("User", userSchema);
export default User;
