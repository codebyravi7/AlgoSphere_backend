import { Router } from "express";
import { UpcomingContestsController } from "../controllers/contest.controller.js";

const contestRouter = Router();

contestRouter.get("/upcoming", UpcomingContestsController);

export default contestRouter;
