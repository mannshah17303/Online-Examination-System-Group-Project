import express from "express";

import { getCompletedExams } from "../../controllers/student.result.controller/getResult.js";
import { viewPaper } from "../../controllers/student.result.controller/viewPaper.js";
import { tokenVerificationForStudent } from "../../middlewares/token.verification.js";

const router = express.Router();

router.get(
  "/get-completedexams",
  tokenVerificationForStudent,
  getCompletedExams
);
router.get("/view-paper/:id", tokenVerificationForStudent, viewPaper);

export default router;
