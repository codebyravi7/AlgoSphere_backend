import mongoose from "mongoose";
const questionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link_lt: {
    type: String,
    required: true,
  },
  link_yt: {
    type: String,
  },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }],
  category: {
    type: String,
  },
  companies: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  tags: {
    type: String,
  },
  serialNo: {
    type: Number,
  },
});
export const Question = mongoose.model("Question", questionSchema);
