import express from "express";
import {
  addquestion,
  allquestion,
  addRemovequestion,
  doneUndonequestion,
  getonequestion,
} from "../controllers/question.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/all", protectRoute, allquestion);
router.get("/one/:id", protectRoute, getonequestion);
router.post("/add", addquestion);
router.post("/add-remove", protectRoute, addRemovequestion);
router.get("/:id", protectRoute, doneUndonequestion);
export default router;
