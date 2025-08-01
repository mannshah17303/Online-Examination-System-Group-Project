import { responseObj } from '../../../utils/responseObj.js';
import {
    fetchQuestionsByCategory,
    getCategoryById,
    addQuestion,
    getQuestionData,
    updateQuestion,
    softDeleteQuestion,
    getAnswerData,
    updateAnswer,
    addQuestionSubjective,
} from '../../../database/Admin Database Query/Que_Ans/dbQuery_questionbank_query.js';
import { layouts } from 'chart.js';

import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
// app.set("views", path.resolve("./src/views"))
app.set("views", path.join(__dirname, "src/views"))



// Function to get questions by category
const Get_Ques_By_Category = async (req, res) => {
    const admin_id = req.userId;
    const categoryId = req.params.categoryId;

    try {
        const isValidCategory = await checkCategoryOwnership(admin_id, categoryId);
        if (!isValidCategory) {
            return res.json(responseObj(false, 403, "You do not have access to this category"));
        }
        const questions = await fetchQuestionsByCategory(categoryId, admin_id);
        if (questions && questions.length > 0) {
            return res.json(responseObj(true, 200, "Questions fetched successfully", questions));
        } else {
            return res.json(responseObj(false, 400, "No questions found in this category. Wish To Add?"));
        }
    } catch (error) {
        // console.error("Error fetching questions by category:", error);
        return res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};
const checkCategoryOwnership = async (admin_id, categoryId) => {
    // console.log("Checking ownership for Category ID:", categoryId, "Admin ID:", admin_id);
    const category = await getCategoryById(admin_id, categoryId);
    return category !== null;
};


const Render_Add_Ques_Page = (req, res) => {
    const categoryId = req.query.categoryId;

    res.render("admin/listQuestions", {
        title: "Dashboard",
        categoryId: categoryId,
        layout: "layouts/admin-layout.ejs",
    });
};


// Function to add a new question
const Add_Ques = async (req, res) => {
    const { cate_id: categoryId, question: questionText, type: questionType, questionAnswer : questionAnswer } = req.body;
    // console.log(req.body);
    try {
        const result = await addQuestionSubjective(categoryId, questionText, questionType, questionAnswer);
        res.status(201).json(responseObj(true, 201, "Question added successfully", { questionId: result.insertId }));
    } catch (error) {
        // console.error("Error adding question:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};


// Function to get data of seleted question
const Get_Update_Ques_Data = async (req, res) => {
    const questionId = req.params.questionId;
    try {
        const questionData = await getQuestionData(questionId);
        if (questionData) {
            res.status(200).json(responseObj(true, 200, "Question data fetched successfully", questionData));
        }
        else {
            res.status(404).json(responseObj(false, 404, "No question found with this id"));
        }
    } catch (error) {
        // console.error("Error fetching question data:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
}

// Function to get answer of seleted question
const get_answer_of_selected_question = async (req, res) => {
    const questionId = req.params.questionId;
    try {
        const answerData = await getAnswerData(questionId);
        if (answerData) {
            res.status(200).json(responseObj(true, 200, "Answer data fetched successfully", answerData));
        }
        else {
            res.status(404).json(responseObj(false, 404, "No answer found with this id"));
        }
    } catch (error) {
        // console.error("Error fetching question data:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
}

// Function to update an existing question
const Update_Ques = async (req, res) => {
    const questionId = req.params.questionId;
    // console.log("Updating Question ID:", questionId);

    const { text: questionText, answerOfQuestion : answerOfQuestion } = req.body;
    // console.log("Question Text:", questionText);

    try {
        const result = await updateQuestion(questionId, questionText);
        const answerResult = await updateAnswer(questionId, answerOfQuestion);
        if (result.affectedRows > 0) {
            if (answerResult.affectedRows > 0){
                res.status(200).json(responseObj(true, 200, "Question updated successfully"));
            }
            else{
                res.send(responseObj(false, 404, "Answer not found"));
            }
        } else {
            res.status(404).json(responseObj(false, 404, "Question not found"));
        }
    } catch (error) {
        // console.error("Error updating question:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};

// Function to soft delete a question
const Delete_Ques = async (req, res) => {
    const questionId = req.params.questionId;

    try {
        const result = await softDeleteQuestion(questionId);
        if (result.affectedRows > 0) {
            res.status(200).json(responseObj(true, 200, "Question deleted successfully"));
        } else {
            res.status(404).json(responseObj(false, 404, "Question not found or already deleted"));
        }
    } catch (error) {
        // console.error("Error soft deleting question:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};

export {
    Get_Ques_By_Category,
    Render_Add_Ques_Page,
    Add_Ques,
    Get_Update_Ques_Data,
    Update_Ques,
    Delete_Ques,
    get_answer_of_selected_question
}

