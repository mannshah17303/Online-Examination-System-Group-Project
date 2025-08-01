import { responseObj } from '../../../utils/responseObj.js';
import {
    insertIntoMcqAnswersTable,
    updateAnswerInMcqAnswersTable,
    deleteAnswerFromMcqAnswersTable,
    fetchAnswersByQuestionId
} from '../../../database/Admin Database Query/Que_Ans/dbQuery_mcq_query.js';

import {
    addQuestion,
} from '../../../database/Admin Database Query/Que_Ans/dbQuery_questionbank_query.js'

// ------------------- Adding MCQ's to the database ------------------- 

const addMcqAnswer = async (req, res) => {
    const { categoryId, question, options, type } = req.body;
    // console.log(req.body);

    try {
        const questionType = type;
        const category_Id = categoryId;

        const questionResult = await addQuestion(category_Id, question, questionType);

        const newQuestionId = questionResult.insertId;

        for (const option of options) {
            const { text, value } = option;
            // console.log(text, value);
            await insertIntoMcqAnswersTable(newQuestionId, text, value);
        }

        // Respond with success
        res.status(201).json({
            success: true,
            message: "Question and options added successfully",
            question_id: newQuestionId
        });
    } catch (error) {
        console.error("Error adding MCQ answer:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ------------------- Updating MCQ's from the database ------------------- 

const updateMcqAnswer = async (req, res) => {
    const answerId = req.params.answerId;
    const { answer_text, is_correct } = req.body;

    try {
        const result = await updateAnswerInMcqAnswersTable(answerId, answer_text, is_correct);
        if (result.affectedRows > 0) {
            res.status(200).json(responseObj(true, 200, "Answer updated successfully"));
        } else {
            res.status(404).json(responseObj(false, 404, "Answer not found"));
        }
    } catch (error) {
        console.error("Error updating MCQ answer:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};


// ------------------- Deleteing MCQ's from the database ------------------- 

const deleteMcqAnswer = async (req, res) => {
    const answerId = req.params.answerId;
    try {
        const result = await deleteAnswerFromMcqAnswersTable(answerId);
        if (result.affectedRows > 0) {
            res.status(200).json(responseObj(true, 200, "Answer deleted successfully"));
        } else {
            res.status(404).json(responseObj(false, 404, "Answer not found"));
        }
    } catch (error) {
        console.error("Error deleting MCQ answer:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};

// ------------------- Fetch MCQ's By Ques from the database ------------------- 

const getMcqAnswersByQuestion = async (req, res) => {
    const questionId = req.params.questionId;
    // console.log(questionId);
    try {
        const answers = await fetchAnswersByQuestionId(questionId);
        if (answers.length > 0) {
            res.status(200).json(responseObj(true, 200, "Answers fetched successfully", answers));
        } else {
            res.status(404).json(responseObj(false, 404, "No answers found for this question"));
        }
    } catch (error) {
        console.error("Error fetching MCQ answers by question ID:", error);
        res.status(500).json(responseObj(false, 500, "Internal Server Error"));
    }
};

export {
    addMcqAnswer,
    updateMcqAnswer,
    deleteMcqAnswer,
    getMcqAnswersByQuestion,
}

