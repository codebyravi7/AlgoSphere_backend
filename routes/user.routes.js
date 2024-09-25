import express from "express";
import { addFriend,allfriends ,areFriend, userProfile} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addfriend",protectRoute ,addFriend);
router.get("/allfriend",protectRoute ,allfriends);
router.get("/arefriend/:id",protectRoute ,areFriend);
router.get("/:id/profile",protectRoute ,userProfile);

export default router;
