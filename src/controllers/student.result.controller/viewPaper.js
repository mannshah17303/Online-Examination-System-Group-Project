import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const viewPaper = async (req, res) => {
  try{
    
    const exam_id = req.params.id;
    console.log("exam id in controller is", exam_id);
    const student_id = req.userId;
    console.log("in view paper", student_id);
    const questions = [];
    
  
    let questionsOfExam = await databaseQuery(
      `SELECT id, question_id,marks,(select question_text from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_text,(select question_type from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_type from exam_questions_tbl where exam_id=?`,
      exam_id
    );
    // console.log(questionsOfExam);

    let answer = await databaseQuery(
      `SELECT * from student_ans_tbl as snt where student_id=${student_id} and snt.exam_id=${exam_id}`
    );

    let options = [];
    for (let i = 0; i < questionsOfExam.length; i++) {
      let allOptionsObjectArray = [];
      options = await databaseQuery(
        `SELECT * FROM mcq_answers_tbl WHERE question_id=${questionsOfExam[i].question_id}`
      );
      for (let j = 0; j < options.length; j++) {
        let optionsObject = {
          optionId: options[j].answer_id,
          optionText: options[j].answer_text,
          isCorrect: options[j].is_correct,
        };
        allOptionsObjectArray.push(optionsObject);
      }

      let tempQuestionObject = {
        questionId: questionsOfExam[i].question_id,
        questionText: questionsOfExam[i].question_text,
        questionType: questionsOfExam[i].question_type,
        questionMark: questionsOfExam[i].marks,

        options: allOptionsObjectArray,
      };
      // console.log(answer[i]);
      // console.log(questionsOfExam[i].question_id);
      let stuAns = answer.filter(
        (e) => e.question_id == questionsOfExam[i].question_id
      );
      // console.log(stuAns);
      if (stuAns.length > 0) {
        tempQuestionObject["student_answer"] = stuAns[0];
      }

      questions.push(tempQuestionObject);
    }

    
  
    res.send(responseObj(true,200,"get paper successfully",questions));
  }catch(err){
    console.log("err",err);
    res.send(responseObj(false,401,"get paper fail"))
  }
};
