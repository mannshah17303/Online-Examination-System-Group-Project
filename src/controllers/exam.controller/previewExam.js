import { databaseQuery } from "../../database/databaseQuery.js"
import { responseObj } from "../../utils/responseObj.js";


//get data for preview exam
export const previewExam = async (req, res) => {
    const { examid } = req.query
    var questions = [];
    try {
        let ExamBasicData = await databaseQuery(`SELECT *,( SELECT count(*) from batch_students_tbl where batch_id in (SELECT batch_id from exam_batches_tbl where exam_batches_tbl.exam_id=E.exam_id)) as total_candidates FROM exam_tbl E WHERE E.exam_id=? `, examid)

        let QuecategoriesOfcreatedExams = await databaseQuery(`SELECT category_name from category_tbl where category_id in(SELECT category_id from question_tbl where question_id in (SELECT question_id from exam_questions_tbl where exam_id=?))`, examid)

        let questionsOfExam = await databaseQuery(`SELECT id, question_id,marks,(select question_text from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_text,(select question_type from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_type from exam_questions_tbl where exam_id=?`, examid)


        for (let i = 0; i < questionsOfExam.length; i++) {
            let allOptionsObjectArray = []
            let options = await databaseQuery(`SELECT * FROM mcq_answers_tbl WHERE question_id=${questionsOfExam[i].question_id}`)
            for (let j = 0; j < options.length; j++) {
                let optionsObject = {
                    optionId: options[j].answer_id,
                    optionText: options[j].answer_text,
                    isCorrect: options[j].is_correct
                }
                allOptionsObjectArray.push(optionsObject);
            }
            let tempQuestionObject = {
                questionId: questionsOfExam[i].question_id,
                questionText: questionsOfExam[i].question_text,
                marks: questionsOfExam[i].marks,
                questionType: questionsOfExam[i].question_type,
                marks: questionsOfExam[i].marks,
                options: allOptionsObjectArray
            }
            questions.push(tempQuestionObject);
        }

        let previewExamData = {
            ExamBasicData: ExamBasicData,
            QuecategoriesOfcreatedExams: QuecategoriesOfcreatedExams,
            questions: questions
        }
       // console.log(previewExamData);
        res.json(responseObj('true', 200, "Sending previewExamData", previewExamData));
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }


}
