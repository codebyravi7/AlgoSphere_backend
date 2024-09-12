import express from "express";

import {
  addComment,
  deletePost,
  likePost,
  getOnePost,
  allPosts,
  searchPost,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// router.post("/add",protectRoute, addPost);
// router.put("/edit", protectRoute, editPost);
router.post("/delete", protectRoute, deletePost);
router.put("/like", protectRoute, likePost);
router.post("/addcomment", protectRoute, addComment);

router.get("/allposts", protectRoute, allPosts);
router.get("/:id", protectRoute, getOnePost);


//get post for search//using post route..
router.post("/search", protectRoute, searchPost);
export default router;
