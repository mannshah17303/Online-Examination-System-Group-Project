import { databaseQuery } from "../database/databaseQuery.js";
import { jwtVerifyFn } from "../utils/jwt.js";
import { responseObj } from "../utils/responseObj.js";

export function renderResult(req, res) {
  res.render("./Admin-result/Result.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
}

export const renderStudentResult = (req, res) => {
  const examId = req.body.examId;
  console.log(examId);

  res.render("./Admin-result/studentResult.ejs", {
    examId,
    layout: "layouts/admin-layout.ejs",
  });
};

// export function renderStudentResult(req, res) {
//   console.log("hel");

//   console.log(req.body.exam_id);
//   let examId = req.body.exam_id;
//   res.render("./Admin-result/studentResult.ejs", {
//     examId,
//     layout: "layouts/admin-layout.ejs",
//   });
// }

export async function getExamResult(req, res) {
  try {
    // console.log(req.body);

    let created_by = req.userId;
    // console.log(created_by);
    let offset = (req.body.page - 1) * 5;
    let like = req.body.like;
    if (!like) {
      like = "";
    }
    let exams = await databaseQuery(
      `SELECT exam_id FROM assessed_exam_tbl WHERE exam_id in(SELECT exam_tbl.exam_id FROM exam_tbl WHERE exam_tbl.created_by=${created_by} and exam_tbl.exam_name like '%${like}%') `
    );
    if (exams.length < offset || offset < 0) {
      res.status(401).json(responseObj(false, 401, "Page Not Found"));
    } else {
      let examData = await databaseQuery(
        `SELECT exam_tbl.exam_id,exam_tbl.exam_name,(SELECT COUNT(*) FROM exam_attempts_tbl WHERE exam_attempts_tbl.exam_id=exam_tbl.exam_id)as present_candidate,(SELECT COUNT(*)from exam_student_tbl where exam_student_tbl.exam_id=exam_tbl.exam_id) as invited_candidate,(SELECT count(*) from exam_results_tbl WHERE exam_results_tbl.obtained_marks>=exam_tbl.passing_marks AND exam_results_tbl.attempt_id in (SELECT exam_attempts_tbl.attempt_id FROM exam_attempts_tbl WHERE exam_attempts_tbl.exam_id=exam_tbl.exam_id))as pass_candidate FROM assessed_exam_tbl JOIN exam_tbl on exam_tbl.exam_id=assessed_exam_tbl.exam_id WHERE exam_tbl.created_by=${created_by} and exam_tbl.exam_name like '%${like}%' ORDER by assessed_exam_tbl.time_stamp desc limit 5 offset ${offset}`
      );
      // console.log(exams);
      // console.log(examData);
      res.status(200).json(
        responseObj(true, 200, "succesfully data get", {
          length: exams.length,
          examData,
        })
      );
    }
  } catch (err) {
    console.log("err", err);
    res.status(401).json(responseObj(false, 401, "failed to get data"));
  }
}

export async function getStudentExamResult(req, res) {
  try {
    let exam_id = req.body.exam_id;

    let examData = await databaseQuery(
      `select exam_id,exam_name,total_marks,passing_marks from exam_tbl where exam_id=${exam_id}`
    );
    // console.log(examData[0]);
    let studentData = await databaseQuery(
      `SELECT exam_attempts_tbl.student_id,students_tbl.first_name,students_tbl.last_name,students_tbl.email,exam_results_tbl.obtained_marks,CASE WHEN exam_results_tbl.obtained_marks>=${examData[0]["passing_marks"]} then "pass" ELSE "fail" end as PassOrFail from exam_attempts_tbl JOIN students_tbl on exam_attempts_tbl.student_id=students_tbl.student_id JOIN exam_results_tbl on exam_attempts_tbl.attempt_id=exam_results_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${examData[0].exam_id}`
    );
    // console.log(studentData);
    res.status(200).json(
      responseObj(true, 200, "succesfully data get", {
        studentData,
        examData,
      })
    );
  } catch (error) {
    // console.log(error);
    res.status(401).json(responseObj(false, 401, "failed to get data"));
  }
}
