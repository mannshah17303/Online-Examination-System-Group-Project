import { databaseQuery } from "../../database/databaseQuery.js";
import cloudinary from "../../utils/cloudinary.js";
import getRandomInt from "../../utils/randomNum.js";
import { responseObj } from "../../utils/responseObj.js";
import fs from "fs";

export const startExamBtnClicked = async (req, res) => {
  try {
    let studentId = req.userId;
    let examId = req.body.exam_id;
    // console.log("exam id is in startExamBtnClicked", examId);

    let attemptTableEntry = await databaseQuery(
      `insert into exam_attempts_tbl (student_id, exam_id) values (${studentId}, ${examId})`
    );

    res.send(responseObj(true, 200, "Exam started successfully!!"));
  } catch (err) {
    // console.log('error in startExamBtnClicked');
    console.log(err);
    res.send(responseObj(false, 500, "Error in starting exam"));
  }
};

export const examPage = async (req, res) => {
  try {
    let examId = req.params.id;
    res.render("startExam/examPage.ejs", {
      layout: "layouts/exam-details.ejs",
      examId: examId,
      studentId: req.userId,
    });
  } catch (err) {
    // console.log('error in examPage');
    console.log(err);
    res.send(responseObj(false, 500, "Error in getting exam page"));
  }
};

export const examSidebarDetails = async (req, res) => {
  try {
    let examId = req.body.examId;

    let examDetails = await databaseQuery(
      `select * from exam_tbl where exam_id = ${examId}`
    );

    let adminName = await databaseQuery(
      `select first_name, last_name from admins_tbl where admin_id = ${examDetails[0]["created_by"]}`
    );

    res.send(
      responseObj(true, 200, "examSidebarDetails fetched successfully!!", {
        examDetails: examDetails,
        adminName: adminName,
      })
    );
  } catch (err) {
    // console.log('error in examDetails');
    console.log(err);
    res.send(responseObj(false, 500, "Error in examDetails"));
  }
};

function getRandomizedQuestions(questionsArray) {
  let newQuestionsArray = [];

  while (questionsArray.length > 0) {
    const index = getRandomInt(0, questionsArray.length - 1);
    newQuestionsArray.push(questionsArray[index]);
    questionsArray.splice(index, 1);
  }

  return newQuestionsArray;
}

export const getQuestions = async (req, res) => {
  try {
    let examId = req.body.examId;

    let questionsOfExam = await databaseQuery(
      `SELECT id, question_id,marks,(select question_text from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_text,(select question_type from question_tbl where question_tbl.question_id=exam_questions_tbl.question_id) as question_type from exam_questions_tbl where exam_id = ${examId}`
    );

    let questions = [];

    for (let i = 0; i < questionsOfExam.length; i++) {
      let allOptionsObjectArray = [];

      let options = await databaseQuery(
        `SELECT * FROM mcq_answers_tbl WHERE question_id=${questionsOfExam[i].question_id}`
      );

      for (let j = 0; j < options.length; j++) {
        let optionsObject = {
          optionId: options[j].answer_id,
          optionText: options[j].answer_text,
        };

        allOptionsObjectArray.push(optionsObject);
      }

      let tempQuestionObject = {
        questionId: questionsOfExam[i].question_id,
        questionText: questionsOfExam[i].question_text,
        questionMarks: questionsOfExam[i].marks,
        questionType: questionsOfExam[i].question_type,
        options: allOptionsObjectArray,
      };

      questions.push(tempQuestionObject);
    }

    const randomizedQuestions = getRandomizedQuestions(questions);

    res.send(
      responseObj(
        false,
        200,
        "questions fetched successfully",
        randomizedQuestions
      )
    );
  } catch (err) {
    // console.log('error in getting questions');
    res.send(responseObj(false, 500, "Error in getting exam questions"));
  }
};

export const studentAnswersSubmission = async (req, res) => {
  try {
    let studentAnswers = req.body.studentAnswers;
    let studentId = req.userId;
    console.log("studentId: ", studentId);
    let examId = req.body.examId;
    let questionIds = req.body.questionIds;
    let allMcq = true;
    const existingAnswers = await databaseQuery(
      `SELECT * FROM student_ans_tbl WHERE student_id = ${studentId} AND exam_id = ${examId} LIMIT 1`
    );

    if (existingAnswers && existingAnswers.length > 0) {
      return res.send(
        responseObj(true, 200, "Exam has already been submitted")
      );
    }
    // let ifExamAlreadyGiven = await databaseQuery(`select * from exam_attempts_tbl where student_id = ${studentId} and exam_id = ${examId}`);

    // if (Object.entries(ifExamAlreadyGiven).length > 0){
    //     res.send(responseObj(false, 400, 'Exam already given'));
    // }
    // else{

    let attemptTableEntry = await databaseQuery(
      // `insert into exam_attempts_tbl (student_id, exam_id, submission_time) values (${studentId}, ${examId}, CURRENT_TIMESTAMP);`
      `update exam_attempts_tbl set submission_time = CURRENT_TIMESTAMP where student_id = ${studentId} and exam_id = ${examId};`
    );

    // let updateSubmissionTimeInAttemptTable = await databaseQuery(
    //   `update exam_attempts_tbl set submission_time = CURRENT_TIMESTAMP where student_id = ${studentId} and exam_id = ${examId}`
    // );

    for (let i = 0; i < studentAnswers.length; i++) {
      let questionType = await databaseQuery(
        `select question_type from question_tbl where question_id = ${questionIds[i]}`
      );
      // console.log("questionType: ", questionType);

      // if (questionType[0]["question_type"] == "MCQ") {
      //   let answer = await databaseQuery(
      //     `select answer_text from mcq_answers_tbl where question_id = ${questionIds[i]} and is_correct = 1`
      //   );
      //   // console.log("answer: ", answer);
      //   // console.log("correct answer is", answer[0]["answer_text"]);
      //   // console.log("student answer is", studentAnswers[i]);

      //   if (answer[0]["answer_text"] == studentAnswers[i]) {
      //     let questionMarks = await databaseQuery(
      //       `select marks from exam_questions_tbl where question_id = ${questionIds[i]} and exam_id = ${examId}`
      //     );
      //     // console.log("questionMarks: ", questionMarks[0]);

      //     let insertStudentAnswer = await databaseQuery(
      //       `insert into student_ans_tbl (student_id, exam_id, question_id, answer_txt, obtained_mark) values ?;`
      //     [[[studentId,examId,questionIds[i],studentAnswers[i],questionMarks[0]["marks"]]]]);
      //   } else {
      //     let insertStudentAnswer = await databaseQuery(
      //       `insert into student_ans_tbl (student_id, exam_id, question_id, answer_txt, obtained_mark) values ?;`
      //        [[[studentId,examId,questionIds[i],studentAnswers[i],`0`]]]);
      //   }
      // } else {
      //   allMcq = false;

      //   let insertStudentAnswer = await databaseQuery(
      //     `insert into student_ans_tbl (student_id, exam_id, question_id, answer_txt) values ?;`
      //     [[[studentId,examId,questionIds[i],studentAnswers[i]]]]);
      // }
      if (questionType[0]["question_type"] === "MCQ") {
        let answer = await databaseQuery(
          "SELECT answer_text FROM mcq_answers_tbl WHERE question_id = ? AND is_correct = 1",
          [questionIds[i]]
        );

        if (answer.length > 0 && answer[0]["answer_text"] === studentAnswers[i]) {
          let questionMarks = await databaseQuery(
            "SELECT marks FROM exam_questions_tbl WHERE question_id = ? AND exam_id = ?",
            [questionIds[i], examId]
          );

          await databaseQuery(
            "INSERT INTO student_ans_tbl (student_id, exam_id, question_id, answer_txt, obtained_mark) VALUES (?, ?, ?, ?, ?)",
            [studentId, examId, questionIds[i], studentAnswers[i], questionMarks[0]["marks"]]
          );
        } else {
          await databaseQuery(
            "INSERT INTO student_ans_tbl (student_id, exam_id, question_id, answer_txt, obtained_mark) VALUES (?, ?, ?, ?, ?)",
            [studentId, examId, questionIds[i], studentAnswers[i], 0]
          );
        }
      } else {
        allMcq = false;

        await databaseQuery(
          "INSERT INTO student_ans_tbl (student_id, exam_id, question_id, answer_txt) VALUES (?, ?, ?, ?)",
          [studentId, examId, questionIds[i], studentAnswers[i]]
        );
      }

    }

    if (allMcq) {
      let totalMarks = await databaseQuery(
        `SELECT SUM(obtained_mark) as obtained_mark FROM student_ans_tbl WHERE exam_id = ${examId} and student_id = ${studentId}`
      );
      // console.log("totalMarks: ", totalMarks);

      let attemptId = await databaseQuery(
        `select attempt_id from exam_attempts_tbl where student_id = ${studentId} and exam_id = ${examId}`
      );
      // console.log("attemptId: ", attemptId);

      // let examResultTableEntry = await databaseQuery(
      //   `insert into exam_results_tbl (attempt_id, obtained_marks) values (${attemptId[0]["attempt_id"]}, ${totalMarks[0]["obtained_mark"]})`
      // );
    }

    res.send(responseObj(true, 200, "Paper submitted successfully!!"));
  } catch (err) {
    // }
    // console.log("error in studentAnswersSubmission");
    console.log(err);
    res.send(responseObj(false, 500, "Error in studentAnswersSubmission"));
  }
};

export const uploadScreenRecording = async (req, res) => {
  try {
    const filePath = req.file.path;
    const newFilePath = `./public/uploads/examId-${req.body.examId}_studentId-${req.userId
      }.${filePath.split(".")[1]}`;
    fs.renameSync(filePath, newFilePath);

    let result = await cloudinary.uploader.upload(newFilePath, {
      resource_type: "video",
      folder: "student-recordings",
    });
    // console.log("result: ", result);

    fs.unlinkSync(newFilePath);

    await databaseQuery(
      `insert into student_recording_tbl(exam_id, student_id, recording_url) values(?, ?, ?);`,
      [req.body.examId, req.userId, result.secure_url]
    );

    return res.status(200).json(
      responseObj(true, 200, "video uploaded successfully!", {
        url: result.secure_url,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(responseObj(false, 500, "Error while uploading video!", error));
  }
};
