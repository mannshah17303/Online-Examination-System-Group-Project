import { databaseQuery } from '../../databaseQuery.js';


// Function to get the question type by ID
const getQuestionTypeById = async (questionId) => {
    const query = `SELECT question_type FROM question_tbl WHERE question_id = ?`;
    try {
        const result = await databaseQuery(query, [questionId]);
        return result.length > 0 ? result[0].question_type : null;
    } catch (error) {
        // console.error("Error fetching question type:", error);
        throw new Error("Failed to fetch question type.");
    }
};

// Function to insert into mcq_answers_tbl
const insertIntoMcqAnswersTable = async (questionId, answerText, isCorrect) => {
    const query = `INSERT INTO mcq_answers_tbl (question_id, answer_text, is_correct) VALUES (?, ?, ?)`;
    try {
        const result = await databaseQuery(query, [questionId, answerText, isCorrect]);
        return result;
    } catch (error) {
        // console.error("Error inserting into mcq_answers_tbl:", error);
        throw new Error("Failed to insert answer into mcq_answers_tbl.");
    }
};

// Function to update answer in mcq_answers_tbl
const updateAnswerInMcqAnswersTable = async (answerId, answerText, isCorrect) => {
    const query = `UPDATE mcq_answers_tbl SET answer_text = ?, is_correct = ? WHERE answer_id = ?`;
    try {
        const result = await databaseQuery(query, [answerText, isCorrect, answerId]);
        return result;
    } catch (error) {
        // console.error("Error updating answer in mcq_answers_tbl:", error);
        throw new Error("Failed to update answer.");
    }
};

// Function to delete answer from mcq_answers_tbl
const deleteAnswerFromMcqAnswersTable = async (answerId) => {
    const query = `DELETE FROM mcq_answers_tbl WHERE answer_id = ?`;
    try {
        const result = await databaseQuery(query, [answerId]);
        return result;
    } catch (error) {
        // console.error("Error deleting answer from mcq_answers_tbl:", error);
        throw new Error("Failed to delete answer.");
    }
};

// Function to fetch answers by question ID from mcq_answers_tbl
const fetchAnswersByQuestionId = async (questionId) => {
    const query = `SELECT answer_id, question_id, answer_text, is_correct FROM mcq_answers_tbl WHERE question_id = ?`;
    try {
        const result = await databaseQuery(query, [questionId]);
        return result;
    } catch (error) {
        // console.error("Error fetching answers by question ID:", error);
        throw new Error("Failed to fetch answers.");
    }
};



export {
    getQuestionTypeById,
    insertIntoMcqAnswersTable,
    updateAnswerInMcqAnswersTable,
    deleteAnswerFromMcqAnswersTable,
    fetchAnswersByQuestionId,
}