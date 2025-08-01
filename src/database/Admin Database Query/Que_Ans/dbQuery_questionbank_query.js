import { databaseQuery } from '../../databaseQuery.js';


const fetchQuestionsByCategory = async (categoryId, adminId) => {
    const query = `
        SELECT q.question_id, q.category_id, q.question_text, q.question_type, q.created_at
        FROM question_tbl q
        JOIN category_tbl c ON q.category_id = c.category_id
        WHERE c.category_id = ? AND c.created_by = ? AND  is_deleted = 0;
    `;
    try {
        const result = await databaseQuery(query, [categoryId, adminId]);
        if (result.length === 0) {
            return { message: "No questions found for this category." };
        }
        return result;
    } catch (error) {
        // console.error("Error fetching questions by category:", error);
        throw new Error("Failed to fetch questions by category.");
    }
};

const getCategoryById = async (admin_id , categoryId) => {
    const query = `
        SELECT 
            category_id, 
            category_name, 
            created_by, 
            created_at 
        FROM 
            category_tbl 
        WHERE 
            category_id = ? AND created_by = ?;
    `;
    try {
        const result = await databaseQuery(query, [categoryId,admin_id]);
        if (result.length === 0) {
            return null;
        }
    } catch (error) {
        // console.error("Error fetching category by id:", error);
        throw new Error("Failed to fetch category by id.");
    }
};
const addQuestionSubjective = async (categoryId, questionText, questionType, questionAnswer) => {
    const query = `INSERT INTO question_tbl (category_id, question_text, question_type) VALUES (?, ?, ?)`;

    const answerStoreQuery = `insert into mcq_answers_tbl (question_id, answer_text, is_correct) values (?, ?, 1)`;
    try {
        const result = await databaseQuery(query, [categoryId, questionText, questionType]);

        const answerStoreQueryResult = await databaseQuery(answerStoreQuery, [result.insertId, questionAnswer]);
        
        return result;
    } catch (error) {
        // console.error("Error adding question:", error);
        throw new Error("Failed to add question.");
    }
};
const addQuestion = async (categoryId, questionText, questionType) => {
    const query = `INSERT INTO question_tbl (category_id, question_text, question_type) VALUES (?, ?, ?)`;

    try {
        const result = await databaseQuery(query, [categoryId, questionText, questionType]);
        
        return result;
    } catch (error) {
        // console.error("Error adding question:", error);
        throw new Error("Failed to add question.");
    }
};


const getQuestionData = async (que_d) => {
    const query = `SELECT * FROM question_tbl where question_id = ?`;
    try {
        const result = await databaseQuery(query, [que_d]);
        return result;
    } catch (error) {
        // console.error("Error fetching question data:", error);
        throw new Error("Failed to fetch question data.");
    }
}

const getAnswerData = async (que_d) => {
    const query = `SELECT * FROM mcq_answers_tbl where question_id = ? and is_correct = 1`;
    try {
        const result = await databaseQuery(query, [que_d]);
        return result;
    } catch (error) {
        // console.error("Error fetching question data:", error);
        throw new Error("Failed to fetch question data.");
    }
}

const updateAnswer = async (questionId, answer) => {
    console.log(questionId);
    console.log(answer);
    const query = `UPDATE mcq_answers_tbl SET answer_text = ? WHERE question_id = ?`;
    try {
        const result = await databaseQuery(query, [answer, questionId]);
        return result;
    } catch (error) {
        // console.error("Error updating question:", error);
        throw new Error("Failed to update answer.");
    }
};
const updateQuestion = async (questionId, questionText) => {
    const query = `UPDATE question_tbl SET question_text = ? WHERE question_id = ?`;
    try {
        const result = await databaseQuery(query, [questionText, questionId]);
        return result;
    } catch (error) {
        // console.error("Error updating question:", error);
        throw new Error("Failed to update question.");
    }
};

const softDeleteQuestion = async (questionId) => {
    const query = `Update question_tbl SET is_deleted = 1 WHERE question_id = ?`;
    try {
        const result = await databaseQuery(query, [questionId]);
        return result;
    } catch (error) {
        // console.error("Error soft deleting question:", error);
        throw new Error("Failed to soft delete question.");
    }
};

export {
    fetchQuestionsByCategory,
    getCategoryById,
    addQuestion,
    getQuestionData,
    updateQuestion,
    softDeleteQuestion,
    getAnswerData,
    updateAnswer,
    addQuestionSubjective
}