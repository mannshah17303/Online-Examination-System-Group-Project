import express from "express";
import {
  renderResult,
  getStudentExamResult,
  getExamResult,
  renderStudentResult,
} from "../../../controllers/studentsResult.js";
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";

const router = express.Router();

router.get("/admin/result", renderResult);

router.post("/admin/student-result", renderStudentResult);

router.post(
  "/api/result/get-exam-student-result",
  tokenVerificationForAdmin,
  getStudentExamResult
);

router.post(
  "/api/result/get-exam-result",
  tokenVerificationForAdmin,
  getExamResult
);

export default router;
