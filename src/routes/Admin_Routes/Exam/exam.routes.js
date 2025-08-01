import express from "express";
import {
  createExamfinal,
  createExamstage1,
} from "../../../controllers/exam.controller/create_exam.js";
import { fetchQuestionsByCategory } from "../../../controllers/exam.controller/fetchQuestionsByCategory.js";
import { getCategoriesForExam } from "../../../controllers/exam.controller/getCategoriesForExam.js";
import { getQuestionForCategories } from "../../../controllers/exam.controller/getQuestion.js";
import { addQuestionToExam } from "../../../controllers/exam.controller/addExamQuestion.js";
import multer from "multer";
import { getExamDetail } from "../../../controllers/exam.controller/getExamDetail.js";

//vineet
import { checkStudentExist } from "../../../controllers/exam.controller/create_exam.js";
import { getUpcomingExams } from "../../../controllers/exam.controller/getUpcomingExams.js";
import { getCurrentExams, getStudentRecordings, getStudentRecordingsPage, getStudentScreenPage } from "../../../controllers/exam.controller/getCurrentExams.js";
import { getCompletedExams } from "../../../controllers/exam.controller/getCompletedExams.js";
import { fecthBasicDataForFinalCreate } from "../../../controllers/exam.controller/fecthBasicDataForFinalCreate.js";
// import { previewExam } from "../controllers/exam.controller/previewExam.js";
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";

const router = express.Router();

import {
  finalExamCreateValidate,
  finalExamEditValidate,
  initialExamCreateValidate,
  marksValidate,
} from "../../../middlewares/validation.exam.js";
import {
  editQuestionExam,
  finalEditSubmit,
  getDataForEditExamQuestions,
  getEditExamData,
} from "../../../controllers/exam.controller/editExam.js";
import { previewExam } from "../../../controllers/exam.controller/previewExam.js";
import { examDelete } from "../../../controllers/exam.controller/deleteExam.js";
import { getPreviewCurrentExamdata } from "../../../controllers/exam.controller/previewCurrentExam.js";

const upload = multer();

router.get("/screen-share/:examId", tokenVerificationForAdmin, getStudentScreenPage);
router.get("/student-screen-recording/:examId", tokenVerificationForAdmin, getStudentRecordingsPage)
router.post("/student-screen-recording", tokenVerificationForAdmin, getStudentRecordings)

//api calls for get question and categories on exam question pages
router.get("/get-categories", tokenVerificationForAdmin, getCategoriesForExam);
router.get(
  "/get-question",
  tokenVerificationForAdmin,
  getQuestionForCategories
);
// router.get("/get-questions", fetchQuestionsByCategory);

router.get("/get-exam-detail", tokenVerificationForAdmin, getExamDetail);
//
router.post(
  "/add-questions",
  tokenVerificationForAdmin,
  marksValidate,
  addQuestionToExam
);

router.get("/exam-question", (req, res) => {
  res.render("exam/listExamQuestions.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
});
//api call for edit exam question

router.get("/exam-question-edit", (req, res) => {
  res.render("exam/editExamQuestions.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
});
router.get(
  "/exam-edit-data",
  tokenVerificationForAdmin,
  getDataForEditExamQuestions
);
router.post(
  "/exam-edit-question-api",
  tokenVerificationForAdmin,
  marksValidate,
  editQuestionExam
);

//api call of stage one exam creation
// router.post('/create-exam-stage1', initialExamCreateValidate, createExamstage1)
router.post("/create-exam-stage1", tokenVerificationForAdmin, initialExamCreateValidate, createExamstage1);

router.get('/exam-create', (req, res) => {
    res.render('exam/initialExamCreate.ejs', { layout: "layouts/admin-layout.ejs" })
})

//exam route to hide exam id
router.post('/exam',tokenVerificationForAdmin, (req, res) => {
    // console.log(req.body.marks);
    if (req.body.marks) {
        res.render('exam/finalExamSetUp.ejs', { layout: "layouts/admin-layout.ejs", examId: req.body.examId });
    } else {
        res.render('exam/listExamQuestions.ejs', { layout: "layouts/admin-layout.ejs", examId: req.body.examId })
    }
})
// router.get('/get-upcomingexams', getUpcomingExams);
router.get("/get-upcomingexams", tokenVerificationForAdmin, getUpcomingExams);

// router.get('/get-currentexams', getCurrentExams);
// router.get('/get-completedexams', getCompletedExams);
router.get("/get-currentexams", tokenVerificationForAdmin, getCurrentExams);
router.get("/get-completedexams", tokenVerificationForAdmin, getCompletedExams);

//api call for final stage exam creation
// router.get('/get-basic-examdata', fecthBasicDataForFinalCreate);
router.get(
  "/get-basic-examdata",
  tokenVerificationForAdmin,
  fecthBasicDataForFinalCreate
);
router.post("/check-student", tokenVerificationForAdmin, checkStudentExist);
router.post(
  "/create-exam-final",
  tokenVerificationForAdmin,
  finalExamCreateValidate,
  createExamfinal
);

router.get("/exam-setup", (req, res) => {
  res.render("exam/finalExamSetUp.ejs", { layout: "layouts/admin-layout.ejs" });
});

// api call for edit exam final stage
router.get("/edit-exam-setup", (req, res) => {
  res.render("exam/editFinalExamSetUp.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
});
router.get("/edit-basic-examdata", tokenVerificationForAdmin, getEditExamData);
router.post(
  "/edit-final-exam",
  tokenVerificationForAdmin,
  finalExamEditValidate,
  finalEditSubmit
);

//preview
router.get('/get-preview-exam-data', tokenVerificationForAdmin, previewExam);
router.get('/preview', (req, res) => {
    res.render('exam/previewExam.ejs', { layout: "layouts/admin-layout.ejs" })
})

// post form render for hide examid in edit mode
router.post('/edit-exam', tokenVerificationForAdmin,(req, res) => {
    // console.log("req.body.marks:",req.body.marks);

    if (req.body.marks == "") {
        res.render('exam/editExamQuestions.ejs', { layout: "layouts/admin-layout.ejs", examId: req.body.examId });
    } else {
        res.render('exam/editFinalExamSetUp.ejs', { layout: "layouts/admin-layout.ejs", examId: req.body.examId });
    }
})

//delete exam
router.post('/delete-exam',tokenVerificationForAdmin,examDelete);

router.post('/current-exam',tokenVerificationForAdmin,(req,res)=>{
    const examId=req.body.examId;
    res.render('exam/currentExam.ejs',{layout: "layouts/admin-layout.ejs",examId:examId})
})
///preview current exam
router.post('/current-exam-data',tokenVerificationForAdmin,getPreviewCurrentExamdata);


export default router;
