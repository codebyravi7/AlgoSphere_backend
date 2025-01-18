import express from "express";

import {
  addComment,
  deletePost,
  likePost,
  getOnePost,
  allPosts,
  searchPost,
  addReplies,
  getReplies,
  editComment,
  deleteComment,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/delete", protectRoute, deletePost);
router.put("/like", protectRoute, likePost);
router.post("/addcomment", protectRoute, addComment);
router.post("/reply", protectRoute, addReplies);
router.get("/reply/:commentId", protectRoute, getReplies);
router.put("/comment/:commentId", protectRoute, editComment);
router.delete("/comment", protectRoute, deleteComment);

router.get("/allposts", protectRoute, allPosts);

//get post for search//using post route..
router.post("/search", protectRoute, searchPost);
router.get("/:id", protectRoute, getOnePost);
export default router;
