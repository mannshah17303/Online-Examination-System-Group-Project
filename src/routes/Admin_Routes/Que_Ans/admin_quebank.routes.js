import express from "express";
const router = express.Router();

// Que-Ans CRUD  Functions
import {
    Get_Ques_By_Category,
    Render_Add_Ques_Page,
    Add_Ques,
    Get_Update_Ques_Data,
    Update_Ques,
    Delete_Ques,
    get_answer_of_selected_question,
} from '../../../controllers/Admin Controller/Que_Ans/admin_quebank.controller.js';

// MCQ CRUD Functions
import {
    addMcqAnswer,
    updateMcqAnswer,
    deleteMcqAnswer,
    getMcqAnswersByQuestion,
} from '../../../controllers/Admin Controller/Que_Ans/admin_mcq.controller.js';
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";


// ------------------- Admin Question-Bank Management -------------------

// Render Add Question Page
router.get('/api/questions',tokenVerificationForAdmin, Render_Add_Ques_Page);
// Get Question by ID based on the category_id
router.get('/api/questions/by-category/:categoryId', tokenVerificationForAdmin, Get_Ques_By_Category);
// Add Question before exam starts
router.post('/api/questions/add', tokenVerificationForAdmin, Add_Ques);
// Update the Question
router.get('/api/questions/update/:questionId', tokenVerificationForAdmin, Get_Update_Ques_Data);
router.get('/api/answer/update/:questionId', tokenVerificationForAdmin, get_answer_of_selected_question);
router.put('/api/questions/update/:questionId', tokenVerificationForAdmin, Update_Ques);
// Delete the Question
router.delete('/api/questions/delete/:questionId', tokenVerificationForAdmin, Delete_Ques);

// ----------------------------------------------------------------------

// ------------------- Admin MCQ Management -------------------


// Route to add a new answer
router.post('/api/mcq-answers/add', tokenVerificationForAdmin, addMcqAnswer);
// Route to update an existing answer by answerId
router.put('/api/mcq-answers/update/:answerId', tokenVerificationForAdmin, updateMcqAnswer);
// Route to delete an answer by answerId
router.delete('/api/mcq-answers/delete/:answerId', tokenVerificationForAdmin, deleteMcqAnswer);
// Route to get answers by questionId
router.get('/api/fetch-mcq/by-question/:questionId', tokenVerificationForAdmin, getMcqAnswersByQuestion);

// ----------------------------------------------------------------------


export default router;