import express from "express";
import {
  assessed,
  attended,
  pending,
  totalInvited,
  getExamData,
} from "../../../controllers/assessment.controller.js";
import {
  getStudentAssessment,
  submitMark,
} from "../../../controllers/student-assessment.controller.js";
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";
import { assessmet_mid } from "../../../middlewares/assessment.js";
const router = express.Router();

router.post(
  "/api/assessment/totalInvited",
  tokenVerificationForAdmin,
  totalInvited
);
router.post(
  "/api/assessment/attended",
  tokenVerificationForAdmin,
  attended
);
router.post(
  "/api/assessment/assessed",
  tokenVerificationForAdmin,
  assessed
);
router.post(
  "/api/assessment/pending",
  tokenVerificationForAdmin,
  pending
);

router.post(
  "/api/assessment/exam-data",
  tokenVerificationForAdmin,
  getExamData
);

router.post(
  "/api/assessment/student/:assess",
  tokenVerificationForAdmin,
  getStudentAssessment
);

router.post(
  "/api/assessment/submit",
  tokenVerificationForAdmin,assessmet_mid,
  submitMark
);

export default router;


