import express from "express";
import { addFriend,allfriends ,areFriend} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addfriend",protectRoute ,addFriend);
router.get("/allfriend",protectRoute ,allfriends);
router.get("/arefriend/:id",protectRoute ,areFriend);

export default router;
