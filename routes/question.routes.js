import express from "express";
import {
  addquestion,
  allquestion,
  addRemovequestion,
  doneUndonequestion,
} from "../controllers/question.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, allquestion);
router.post("/add", addquestion);
router.post("/add-remove", protectRoute, addRemovequestion);
router.get("/:id", protectRoute, doneUndonequestion);
export default router;
