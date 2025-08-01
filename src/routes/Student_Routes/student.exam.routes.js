// var express=require('express');
import express from "express";
// import { create_exam } from "../controllers/exam.controller/create_exam.js";
// import { fetchQuestionsByCategory } from "../controllers/exam.controller/fetchQuestionsByCategory.js";
import { getUpcomingExams } from "../../controllers/student.exam.controller/getUpcomingExams.js";
import { getCurrentExams } from "../../controllers/student.exam.controller/getCurrentExams.js";
import { getCompletedExams } from "../../controllers/student.exam.controller/getCompletedExams.js";
import { tokenVerificationForStudent } from "../../middlewares/token.verification.js";

const router = express.Router();

// router.post('/create-exam',create_exam)
// router.get('/get-questions',fetchQuestionsByCategory)
router.get("/get-upcomingexams", tokenVerificationForStudent, getUpcomingExams);
router.get("/get-currentexams", tokenVerificationForStudent, getCurrentExams);
router.get(
  "/get-completedexams",
  tokenVerificationForStudent,
  getCompletedExams
);

export default router;
