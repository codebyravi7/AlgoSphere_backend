import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

import cloudinary from "cloudinary";
import cloudinaryUploadImage from "../utils/imageUploader.js";
import fs from "fs";
import { Question } from "../models/question.model.js";

export const addPost = async (req, res) => {
  try {
    console.log("backend tak aay hun!!");
    const user = req.user;
    const { id, qid } = req.params;
    const { title, description } = req.body;
    let post;
    if (req.file) {
      const data = await cloudinaryUploadImage(req.file.path);
      const url = data.secure_url;
      const public_id = data.public_id;
      // console.log(data);
      //delete from local storage
      fs.unlink(
        `./public/Images/${data?.original_filename}.${data?.format}`,
        (err) => {
          if (err) {
            console.log("error: ", err);
          } else {
            console.log("file deleted");
          }
        }
      );
      post = new Post({
        user: user._id,
        title,
        description,
        image: { url, public_id },
      });
    } else {
      post = new Post({
        user: user._id,
        title,
        description,
      });
    }
    //agar id solution hai to qid
    //agar id post hai to badhiya hai else case hai ye
    if (id === "post") {
      user?.posts?.push(post._id);
      await Promise.all([post.save(), user.save()]);
    } else {
      const question = await Question.findById(qid);

      if (id === "solution") {
        question?.blogs?.push(post._id);
      } else if (id === "notes") {
        question?.notes?.push(post._id);
        post.public = false;
      }
      await Promise.all([post.save(), question.save()]);
    }

    return res.json({
      message: "Post added successfully!",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding post", err });
  }
};

export const deletePost = async (req, res) => {
  try {
    const user = req.user;
    const { postId } = req.body;
    const post = await Post.findById(postId);
    const public_Id = post.image.public_id;
    await cloudinary.uploader.destroy(public_Id);
    await Post.findByIdAndDelete(postId);
    return res.json({
      message: "Post deleted Successfully",
      post,
      success: false,
    });
  } catch (err) {
    return res.json({ message: "Error in deleting Post", err, success: false });
  }
};
export const editPost = async (req, res) => {
  try {
    const user = req.user;
    const { postId, title, description, previmage } = req.body;
    let post;
    let result;
    if (req.file) {
      const data = await cloudinaryUploadImage(req.file.path);
      const url = data.secure_url;
      const public_id = data.public_id;
      //delete from local storage
      fs.unlink(`./public/Images/${data?.original_filename}.png`, (err) => {
        if (err) {
          console.log("error: ", err);
        } else {
          console.log("file deleted");
        }
      });
      result = await Post.findByIdAndUpdate(postId, {
        title,
        description,
        image: { url, public_id },
      });
      if (previmage) await cloudinary.uploader.destroy(previmage);
    } else {
      result = await Post.findByIdAndUpdate(postId, {
        title,
        description,
      });
    }
    return res.json({
      message: "Post Updated successfully!",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating post", err });
  }
};
export const likePost = async (req, res) => {
  try {
    const user = req.user;
    const { postid } = req.body;
    // console.log("postid::",postid)
    const userId = user?._id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.json({ message: "POST NOT FOUND!!", success: false });
    }
    //   checking if user already liked
    const userLike = post.likes.find((like) => like.equals(userId));

    if (!userLike) {
      post?.likes?.push(userId);
      await post.save();
      return res.json({
        message: "Post liked Successfully",
        post,
        success: false,
      });
    } else {
      post?.likes?.pull(userId);
      await post.save();
      return res.json({
        message: "Post unliked Successfully",
        post,
        success: false,
      });
    }
  } catch (err) {
    return res.json({ message: "Error in liking Post", err, success: false });
  }
};
export const addComment = async (req, res) => {
  try {
    const user = req.user;
    console.log("user: ", user);
    const { postId, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ message: "POST NOT FOUND!!", success: false });
    }
    const newcomment = new Comment({
      // user: user?._id,
      user,
      content,
    });
    // console.log("first");
    await newcomment.save();
    post?.comments?.push(newcomment?._id);
    await post.save();
    return res.json({
      message: "Commented Successfully!",
      success: true,
    });
  } catch (err) {
    return res.json({
      message: "Error in adding Comment",
      err,
      success: false,
    });
  }
};
export const getOnePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user", // Assuming each comment has a `user` field to populate
        },
      });
    res.json({ post });
  } catch (err) {
    return res.json({
      message: "Post Not found !!!!!!!",
      err,
      success: false,
    });
  }
};

export const allPosts = async (req, res) => {
  const allposts = (
    await Post.find({ $or: [{ public: true }, { public: { $exists: false } }] })
  ).reverse();

  res.json({ message: "All posts: ", allposts, success: true });
};
export const searchPost = async (req, res) => {
  const { keyword } = req.body;
  const posts = await Post.find({
    title: { $regex: keyword, $options: "i" }, // Case-insensitive search for the keyword in title
  });

  res.json({ message: "Search posts: ", posts, success: true });
};
