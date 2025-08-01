import express from "express";
import { instructionPage } from "../controllers/start.exam.controller/instruction.page.controller.js";
import { examPage, examSidebarDetails, getQuestions, studentAnswersSubmission } from "../controllers/start.exam.controller/exam.page.controller.js";
import { tokenVerificationForStudent } from "../middlewares/token.verification.js";

const router = express.Router();

// router.post('/start-exam-btn-clicked', tokenVerificationForStudent, startExamBtnClicked);

router.get('/instruction/:id', tokenVerificationForStudent, instructionPage);
router.get('/exam/:id', tokenVerificationForStudent, examPage);

router.post('/exam-sidebar-details', tokenVerificationForStudent, examSidebarDetails);

router.post('/get-questions', getQuestions);

router.post('/student-answers', tokenVerificationForStudent, studentAnswersSubmission);

export default router;