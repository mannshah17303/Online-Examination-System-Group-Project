import express from "express";
import { getStudentDashboardData } from "../../controllers/student.dashboard.controller/studentDashboard.js";
import { tokenVerificationForStudent } from "../../middlewares/token.verification.js";
const router = express.Router();

router.get(
  "/api/student/dashboard",
  tokenVerificationForStudent,
  getStudentDashboardData
);

export default router;
