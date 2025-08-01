import { databaseQuery } from "../database/databaseQuery.js";
import { responseObj } from "../utils/responseObj.js";
import { submitMark } from "./student-assessment.controller.js";

export const getExamData = async (req, res) => {
  try {
    const examId = req.body.examId;
    // console.log("exam_id",req.body);
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
END AS duration from exam_tbl where exam_id=${examId} and created_by=${req.userId}`)
// console.log(duration.duration);

    let auth=await databaseQuery(`select * from exam_tbl where exam_id=${examId} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    if(auth.length==0){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let [data] = await databaseQuery(
      `select exam_name,duration,total_marks,passing_marks from exam_tbl where exam_id = ${examId}`
    );
    return res.status(200).json(responseObj(true, 200, "successfuly get data", data));
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json(responseObj(false, 401, "get exam data failed"));
  }
};

export const totalInvited = async (req, res) => {
  try {
    const examId = req.body.examId;
    let like = req.body.liked;
    if (!like) {
      like = "";
    }
    let offset = (req.body.page - 1) * 5;
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
      ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
      END AS duration from exam_tbl where exam_id=${examId} and created_by=${req.userId}`)
      // console.log(duration.duration);
      
          let auth=await databaseQuery(`select * from exam_tbl where exam_id=${examId} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    if(auth.length==0){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let total = await databaseQuery(
      `select count(student_id) as total_no from exam_student_tbl where exam_id=${examId}`
    );
    let count = await databaseQuery(
      `SELECT count(email) as total from students_tbl WHERE student_id in (select student_id from exam_student_tbl where exam_id=${examId}) and email like '%${like}%'`
    );
    // console.log(count[0].total);
    if (offset > count[0].total || offset < 0) {
      // console.log(count.total);
      throw new Error("Page Dose not exsists");
    }
    let totalInvited = await databaseQuery(
      `SELECT student_id,concat(first_name,' ',last_name) as full_name,email from students_tbl WHERE student_id in (select student_id from exam_student_tbl where exam_id=${examId}) and email like '%${like}%' limit 5 offset ${offset}`
    );
    return res.status(200).json(
      responseObj(true, 200, "get total invited student list successfully!", {
        total_no: total[0].total_no,
        total_page: Math.ceil(count[0].total / 5),
        student_data: totalInvited,
      })
    );
  } catch (err) {
    console.log("err in totalInvited", err);
    return res
      .status(401)
      .json(responseObj(false, 401, "get total invited student list failed!"));
  }
};
export const attended = async (req, res) => {
  try {
    const examId = req.body.examId;
    let offset = (req.body.page - 1) * 5;
    let like = req.body.liked;
    if (!like) {
      like = "";
    }
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
END AS duration from exam_tbl where exam_id=${examId} and created_by=${req.userId}`)
// console.log(duration.duration);

    let auth=await databaseQuery(`select * from exam_tbl where exam_id=${examId} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    if(auth.length==0){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let total = await databaseQuery(
      `select count(student_id)as total_no from exam_attempts_tbl where exam_id=${examId}`
    );
    let count = await databaseQuery(
      `SELECT count(email) as total from students_tbl WHERE student_id in (select student_id from exam_attempts_tbl where exam_id=${examId}) and email like '%${like}%' `
    );
    if (offset > count[0].total || offset < 0) {
      // console.log(count.total);
      throw new Error("Page Dose not exsists");
    }
    let attended = await databaseQuery(
      `SELECT student_id,concat(first_name,' ',last_name) as full_name,email from students_tbl WHERE student_id in (select student_id from exam_attempts_tbl where exam_id=${examId}) and email like '%${like}%' limit 5 offset ${offset}`
    );
    return res.status(200).json(
      responseObj(true, 200, "get attended student list successfully!", {
        total_no: total[0].total_no,
        total_page: Math.ceil(count[0].total / 5),
        student_data: attended,
      })
    );
  } catch (err) {
    // console.log("err in Attended", err);
    return res
      .status(401)
      .json(responseObj(false, 401, "get attended student list failed!"));
  }
};
export const assessed = async (req, res) => {
  try {
    const examId = req.body.examId;
    let offset = (req.body.page - 1) * 5;
    let like = req.body.liked;
    if (!like) {
      like = "";
    }
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
      ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
      END AS duration from exam_tbl where exam_id=${examId} and created_by=${req.userId}`)
      // console.log(duration.duration);
      
          let auth=await databaseQuery(`select * from exam_tbl where exam_id=${examId} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    if(auth.length==0){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let total = await databaseQuery(
      `SELECT COUNT(*) as total_no from exam_results_tbl WHERE exam_results_tbl.attempt_id in (SELECT exam_attempts_tbl.attempt_id FROM exam_attempts_tbl WHERE exam_attempts_tbl.exam_id=${examId})`
    );
    let count = await databaseQuery(
      `SELECT count(students_tbl.email) as total FROM students_tbl JOIN exam_attempts_tbl on students_tbl.student_id=exam_attempts_tbl.student_id JOIN exam_results_tbl on exam_results_tbl.attempt_id=exam_attempts_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examId}  and students_tbl.email like '%${like}%'`
    );
    if (offset > count[0].total || offset < 0) {
      // console.log(count.total);
      throw new Error("Page Dose not exsists");
    }
    let assessed = await databaseQuery(
      `SELECT students_tbl.student_id,concat(students_tbl.first_name," ",students_tbl.last_name) as full_name,students_tbl.email,exam_results_tbl.obtained_marks FROM students_tbl JOIN exam_attempts_tbl on students_tbl.student_id=exam_attempts_tbl.student_id JOIN exam_results_tbl on exam_results_tbl.attempt_id=exam_attempts_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examId}  and students_tbl.email like '%${like}%'  ORDER by exam_results_tbl.result_date limit 5 offset ${offset}`
    );
    return res.status(200).json(
      responseObj(true, 200, "get assessed student list successfully!", {
        total_no: total[0].total_no,
        total_page: Math.ceil(count[0].total / 5),
        student_data: assessed,
      })
    );
  } catch (err) {
    console.log("err in Attended", err);
    return res
      .status(401)
      .json(responseObj(false, 401, "get assessed student list failed!"));
  }
};
export const pending = async (req, res) => {
  try {
    const examId = req.body.examId;
    let offset = (req.body.page - 1) * 5;
    let like = req.body.liked;
    if (!like) {
      like = "";
    }
    let [duration]=await databaseQuery(`select CASE WHEN duration<60 THEN CONVERT(concat("00:",duration,":00"),CHARACTER)
ELSE CONVERT(concat(floor(duration/60),":",duration%60,":00"),CHARACTER)
END AS duration from exam_tbl where exam_id=${examId} and created_by=${req.userId}`)
// console.log(duration.duration);

    let auth=await databaseQuery(`select * from exam_tbl where exam_id=${examId} and created_by=${req.userId} and ADDTIME(exam_end_datetime,'${duration.duration}')<NOW()`)
    // console.log("auth length",auth.length);
    if(auth.length==0){
      return res
      .status(402)
      .json(responseObj(false, 402, "You can't access"));
    }
    let pending = await databaseQuery(
      `SELECT students_tbl.student_id,concat(students_tbl.first_name," ",students_tbl.last_name) as full_name,students_tbl.email from students_tbl WHERE students_tbl.student_id in (SELECT exam_attempts_tbl.student_id from exam_attempts_tbl WHERE exam_attempts_tbl.attempt_id not in (SELECT exam_results_tbl.attempt_id from exam_results_tbl WHERE exam_results_tbl.attempt_id in(SELECT exam_attempts_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examId}))and exam_attempts_tbl.exam_id=${examId})`
    );
    let is_subjective = await databaseQuery(
      `select count(*) as subjective from question_tbl where question_id in (select question_id from exam_questions_tbl where exam_id=${examId}) and question_type='Subjective'`
    );
    // console.log(is_subjective[0].subjective);
    if (is_subjective[0].subjective == 0) {
      for await (const e of pending) {
        console.log(e);
        let obt_marks = await databaseQuery(
          `SELECT sum(exam_questions_tbl.marks) as marks FROM exam_questions_tbl JOIN mcq_answers_tbl on exam_questions_tbl.question_id=mcq_answers_tbl.question_id WHERE exam_questions_tbl.exam_id=${examId} AND mcq_answers_tbl.is_correct=1 and mcq_answers_tbl.answer_text=(SELECT student_ans_tbl.answer_txt FROM student_ans_tbl WHERE exam_id=${examId} AND question_id=exam_questions_tbl.question_id and student_id=${e.student_id})`
        );
        if (obt_marks[0].marks == null) {
          obt_marks[0].marks = 0;
        }
        // console.log(obt_marks[0].marks);
        let [attempt_id] = await databaseQuery(
          `select attempt_id from exam_attempts_tbl where student_id = ${e.student_id} and exam_id = ${examId}`
        );
        await databaseQuery(
          `insert into exam_results_tbl (attempt_id,obtained_marks) values (?,?)`,
          [attempt_id.attempt_id, obt_marks[0].marks]
        );
      }
      // return res.status(200).json(responseObj(true,200,"auto assessed....!"));
    }

    // console.log(offset);
    let total = await databaseQuery(
      `SELECT COUNT(exam_attempts_tbl.student_id) as total_no from exam_attempts_tbl WHERE exam_attempts_tbl.attempt_id not in (SELECT exam_results_tbl.attempt_id from exam_results_tbl WHERE exam_results_tbl.attempt_id in(SELECT exam_attempts_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examId}))and exam_attempts_tbl.exam_id=${examId}`
    );
    let count = await databaseQuery(
      `SELECT count(students_tbl.email) as total from students_tbl WHERE students_tbl.student_id in (SELECT exam_attempts_tbl.student_id from exam_attempts_tbl WHERE exam_attempts_tbl.attempt_id not in (SELECT exam_results_tbl.attempt_id from exam_results_tbl WHERE exam_results_tbl.attempt_id in(SELECT exam_attempts_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examId}))and exam_attempts_tbl.exam_id=${examId}) and students_tbl.email like '%${like}%'`
    );
    if (offset > count[0].total || offset < 0) {
      return res
      .status(401)
      .json(
        responseObj(false, 401, "Page Dose not exsists")
      );
    }
    pending = await databaseQuery(
      `SELECT students_tbl.student_id,concat(students_tbl.first_name," ",students_tbl.last_name) as full_name,students_tbl.email from students_tbl WHERE students_tbl.student_id in (SELECT exam_attempts_tbl.student_id from exam_attempts_tbl WHERE exam_attempts_tbl.attempt_id not in (SELECT exam_results_tbl.attempt_id from exam_results_tbl WHERE exam_results_tbl.attempt_id in(SELECT exam_attempts_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examId}))and exam_attempts_tbl.exam_id=${examId}) and students_tbl.email like '%${like}%' limit 5 offset ${offset}`
    );
    if (total[0].total_no == 0) {
      let search_exam = await databaseQuery(
        `select * from assessed_exam_tbl where exam_id=${examId}`
      );
      let attended=await databaseQuery(`select count(student_id)as total_no from exam_attempts_tbl where exam_id=${examId}`)
      
      if (search_exam == 0 && attended[0].total_no!=0) {
        let insert_exam = await databaseQuery(
          `insert into assessed_exam_tbl(exam_id) value (${examId})`
        );

        
      }
    }
    return res.status(200).json(
      responseObj(
        true,
        200,
        "get pending assessment student list successfully!",
        {
          total_no: total[0].total_no,
          total_page: Math.ceil(count[0].total / 5),
          student_data: pending,
        }
      )
    );
  } catch (err) {
    console.log("err in Attended", err);
    return res
      .status(401)
      .json(
        responseObj(false, 401, "get pending assessment student list failed!")
      );
  }
};
