import { databaseQuery } from "../database/databaseQuery.js";
import { responseObj } from "../utils/responseObj.js";

export async function getStudentAssessment(req, res) {
  try {
    let student_id = req.body.student_id;
    let exam_id = req.body.exam_id;
    let assess = req.params.assess;
    // console.log("in student assessment");
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
    ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
    END AS duration from exam_tbl where exam_id=${exam_id} and created_by=${req.userId}`)
    // console.log(duration.duration);
    
    let auth=await databaseQuery(`select * from exam_tbl where exam_id=${exam_id} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    let [attempt_id] = await databaseQuery(
      `select attempt_id from exam_attempts_tbl where student_id = ${student_id} and exam_id = ${exam_id}`
    );
    // console.log("auth length",auth.length);
    if(auth.length==0 || attempt_id===undefined){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let subjectiveMark = [];
    // console.log(assess);
    if (assess === "view") {
      subjectiveMark = await databaseQuery(
        `SELECT question_tbl.question_id,student_ans_tbl.obtained_mark FROM student_ans_tbl join question_tbl on student_ans_tbl.question_id = question_tbl.question_id where student_ans_tbl.student_id = ${student_id} and student_ans_tbl.exam_id = ${exam_id} and question_tbl.question_type = 'Subjective'`
      );
    }
    let studentData = await databaseQuery(
      `select first_name,last_name,email from students_tbl where student_id = ${student_id}`
    );
    let questionsOfExam = await databaseQuery(
      `SELECT id, question_id,marks,(select question_text from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_text,(select question_type from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_type from exam_questions_tbl where exam_id=?`,
      exam_id
    );
    // console.log(questionsOfExam);

    let answer = await databaseQuery(
      `SELECT * from student_ans_tbl as snt where student_id=${student_id} and snt.exam_id=${exam_id}`
    );
    let questions = [];
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

    res
      .status(200)
      .json(
        responseObj(true, 200, "student result data", [
          studentData,
          questions,
          subjectiveMark,
        ])
      );
  } catch (error) {
    // console.log(error);
    res.status(401).json(responseObj(false, 401, "error occurred"));
  }
}

export async function submitMark(req, res) {
  try {
    
    let student_id = req.body.student_id;
    let exam_id = req.body.exam_id;
    let obtMark = req.body.obtained_mark;
    let stuMark = req.body.stuMark;
    // console.log("marks :",stuMark);
    // console.log("student marks");
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
    ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
    END AS duration from exam_tbl where exam_id=${exam_id} and created_by=${req.userId}`)
    // console.log(duration.duration);
    
    let auth=await databaseQuery(`select * from exam_tbl where exam_id=${exam_id} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    let [attempt_id] = await databaseQuery(
      `select attempt_id from exam_attempts_tbl where student_id = ${student_id} and exam_id = ${exam_id}`
    );
    // console.log("attempt id",attempt_id);
    // console.log("auth length",auth.length);
    if(auth.length==0 || attempt_id===undefined){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let [total_mark]=await databaseQuery(`select total_marks from exam_tbl where exam_id=${req.body.exam_id}`)
    // console.log(total_mark.total_marks);
    // console.log(obtMark);
    if(total_mark.total_marks<obtMark){
      return res
      .status(403)
      .json(responseObj(false, 403, "You can't add marks grater than total_marks"));
    } 
    // console.log(attempt_id);
    let exam_result=await databaseQuery(`select * from exam_results_tbl where attempt_id=${attempt_id.attempt_id} `)
    if(exam_result.length!=0){
      return res
      .status(403)
      .json(responseObj(false, 403, "You can't add marks twice"));
    }
    for (let i = 0; i < stuMark.length; i++) {
      await databaseQuery(
        `update student_ans_tbl set obtained_mark = ${stuMark[i].mark} where question_id = ${stuMark[i].questionId} and student_id = ${student_id} and exam_id = ${exam_id}`
      );
    }
    await databaseQuery(
      `insert into exam_results_tbl (attempt_id,obtained_marks) values (?,?)`,
      [attempt_id.attempt_id, obtMark]
    );
    // console.log(attempt_id);
    res.status(200).json(responseObj(true, 200, "mark set",exam_id));
  } catch (error) {
    // console.log(error);
    res.status(401).json(responseObj(false, 401, "error occurred"));
  }
}
