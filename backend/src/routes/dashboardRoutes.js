import express from "express";
import {
  getStats,
  getStudents,
  getCourseDistribution,
  getWeeklySignups,
  getRecentActivity,
} from "../controllers/dashboardController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All dashboard routes require admin auth
router.use(authenticateUser);
router.use(requireRole("admin"));

router.get("/stats", getStats);
router.get("/students", getStudents);
router.get("/course-distribution", getCourseDistribution);
router.get("/weekly-signups", getWeeklySignups);
router.get("/recent-activity", getRecentActivity);

export default router;
