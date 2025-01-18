import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";

import cloudinary from "cloudinary";
import cloudinaryUploadImage from "../utils/imageUploader.js";
import fs from "fs";
import { Question } from "../models/question.model.js";
import path from "path";

export const addPost = async (req, res) => {
  try {
    const user = req.user;
    const { id, qid } = req.params;
    const { title, description } = req.body;
    let post;
    if (req.file) {
      const data = await cloudinaryUploadImage(req.file.path);
      const url = data.secure_url;
      const public_id = data.public_id;
      //delete from local storage
      fs.unlink(
        `./public/Images/${data?.original_filename}.${data?.format}`,
        (err) => {
          if (err) {
            res.status(404).json("error: ", err);
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

    return res.status(200).json({
      message: "Post added successfully!",
      success: true,
      post,
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding post", err });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    // Find the post to ensure it exists
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Delete associated image from Cloudinary
    const public_Id = post.image?.public_id;
    if (public_Id) {
      await cloudinary.uploader.destroy(public_Id);
    }

    // Function to recursively delete all comments linked to the post
    const deleteComments = async (commentId) => {
      const comment = await Comment.findById(commentId);
      if (comment?.replies?.length) {
        for (const replyId of comment.replies) {
          await deleteComments(replyId); // Delete nested replies
        }
      }
      await Comment.findByIdAndDelete(commentId); // Delete the current comment
    };

    // Delete all comments linked to the post
    for (const commentId of post.comments) {
      await deleteComments(commentId);
    }

    // Delete the post itself
    await Post.findByIdAndDelete(postId);

    return res.json({
      message: "Post and associated comments deleted successfully!",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in deleting Post",
      error: err.message,
      success: false,
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId, title, description, previmage } = req.body;
    let post;
    let result;
    if (req.file) {
      const data = await cloudinaryUploadImage(req.file.path);
      const url = data.secure_url;
      const public_id = data.public_id;
      //delete from local storage
      fs.unlink(
        `./public/Images/${data?.original_filename}.${data?.format}`,
        (err) => {
          if (err) {
            res.status(500).json({ message: err, success: false });
          }
        }
      );
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
      updatedPost: result,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating post", err });
  }
};
export const likePost = async (req, res) => {
  try {
    const user = req.user;
    const { postid } = req.body;
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
    const { postId, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ message: "POST NOT FOUND!!", success: false });
    }
    const newcomment = new Comment({
      userId: user?._id,
      username: user?.fullName,
      content,
    });
    await newcomment.save();
    post?.comments?.unshift(newcomment?._id);
    await post.save();
    return res.status(200).json({
      message: "Commented Successfully!",
      comment: newcomment,
      success: true,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Error in adding Comment",
      err,
      success: false,
    });
  }
};
export const getOnePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "comments",
    });
    res.status(200).json({ post });
  } catch (err) {
    return res.status(404).json({
      message: "Post Not found !!!!!!!",
      err,
      success: false,
    });
  }
};

export const allPosts = async (req, res) => {
  try {
    // Extract page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page if not provided
    // Calculate the starting index for pagination
    const startIndex = (page - 1) * limit;

    // Query the database with pagination
    let allposts = await Post.find({
      $or: [{ public: true }, { public: { $exists: false } }],
    })
      .sort({ _id: -1 }) // Optional: Sort posts in descending order
      .skip(startIndex) // Skip the previous pages' posts
      .limit(limit); // Limit to the number of posts per page

    const totalPosts = await Post.countDocuments({
      $or: [{ public: true }, { public: { $exists: false } }],
    }); // Get the total number of posts for pagination metadata

    res.json({
      message: "All posts:",
      allposts,
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", success: false });
  }
};

export const searchPost = async (req, res) => {
  const { keyword } = req.body;
  const posts = await Post.find({
    title: { $regex: keyword, $options: "i" }, // Case-insensitive search for the keyword in title
  });

  res.json({ message: "Search posts: ", posts, success: true });
};

export const addReplies = async (req, res) => {
  try {
    const user = req.user;
    const { commentId, content } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment NOT FOUND!!", success: false });
    }
    const newcomment = new Comment({
      userId: user?._id,
      username: user?.fullName,
      content,
    });
    await newcomment.save();
    comment?.replies?.unshift(newcomment?._id);
    await comment.save();
    return res.status(200).json({
      message: "Replied Successfully!",
      reply: newcomment,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in adding Comment",
      err,
      success: false,
    });
  }
};
export const getReplies = async (req, res) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const replies = await Comment.findById(commentId).populate({
      path: "replies",
    }); //populate the replies
    return res.status(200).json({
      message: "Replies fetched Successfully!",
      replies,
      success: true,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Error in fetching Replies",
      err,
      success: false,
    });
  }
};
export const editComment = async (req, res) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content: req.body.content },
      { new: true }
    );
    return res.status(200).json({
      message: "Comment edited Successfully!",
      updatedComment,
      success: true,
    });
  } catch (err) {
    return res.status(404).json({
      message: "Error in editing Reply",
      err,
      success: false,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    if (postId) {
      const post = await Post.findById(postId);
      post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== commentId
      );
      await post.save();
    }

    // Find the comment to be deleted
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    // Recursively delete all replies
    const deleteReplies = async (commentId) => {
      const comment = await Comment.findById(commentId);
      if (comment?.replies?.length) {
        for (const replyId of comment.replies) {
          await deleteReplies(replyId); // Delete nested replies first
        }
      }
      await Comment.findByIdAndDelete(commentId); // Delete the current comment
    };

    await deleteReplies(commentId);

    return res.status(200).json({
      message: "Comment and all replies deleted successfully!",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while deleting the comment",
      error: err.message,
      success: false,
    });
  }
};
