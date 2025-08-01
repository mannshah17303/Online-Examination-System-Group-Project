import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";


//fetch category wise questions in fresh exam creation
export const getQuestionForCategories = async (req, res) => {
    try {
        let categoryId = req.query.categoryId;
        let questionType = req.query.questionType;
        let adminId = req.userId;

        var questions = [];  // array of all question
        var results = null
       
        ///quesry to get caegory and question type wise question
        if (categoryId != 'all' && questionType != 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE category_tbl.category_id = ? 
                   AND question_tbl.question_type = ? 
                   AND category_tbl.created_by = ?`,
                [categoryId, questionType, adminId]
            );
        } else if (categoryId != 'all' && questionType == 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE category_tbl.category_id = ? 
                   AND category_tbl.created_by = ?`,
                [categoryId, adminId]
            );
        } else if (categoryId == 'all' && questionType != 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE question_tbl.question_type = ? 
                   AND category_tbl.created_by = ?`,
                [questionType, adminId]
            );
        } else if (categoryId == 'all' && questionType == 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE category_tbl.created_by = ?`,
                [adminId]
            );
        }


        for (let i = 0; i < results.length; i++) {

            let allOptionsObjectArray = []

            let options = await databaseQuery(`SELECT * FROM mcq_answers_tbl WHERE question_id=${results[i].question_id}`) // fetch options of particular option

            for (let j = 0; j < options.length; j++) {
                let optionsObject = {
                    optionId: `${options[j].answer_id}`,
                    optionText: `${options[j].answer_text}`,
                    isCorrect: `${options[j].is_correct}`
                }
                allOptionsObjectArray.push(optionsObject);  // push option into question object
            }

            let tempQuestionObject = {
                questionId: results[i].question_id,
                questionText: results[i].question_text,
                questionType: results[i].question_type,
                options: allOptionsObjectArray
            }

            questions.push(tempQuestionObject); // push question into questions array

        }
        // res.send(questions)
        res.json(responseObj("true", 200, "Category wise question", questions))
    } catch (error) {

        console.log(error);
        res.json(responseObj("false", 500, "something went wrong"));
    }

}
