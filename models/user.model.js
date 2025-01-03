import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    codingProfiles: {
      leetcode: {
        type: String,
        default: "",
      },
      codechef: {
        type: String,
        default: "",
      },
      codeforces: {
        type: String,
        default: "",
      },
    },
    // createdAt, updatedAt => Member since <createdAt>
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
