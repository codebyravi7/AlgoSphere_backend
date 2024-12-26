import express from "express";

import { scheduleEmailNotification } from "../controllers/email.controller.js";

const router = express.Router();

// Route to schedule email notifications
router.post("/", scheduleEmailNotification);

export default router;
