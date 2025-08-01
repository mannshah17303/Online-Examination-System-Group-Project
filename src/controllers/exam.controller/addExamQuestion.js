import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";


//make entry of question in fresh exam creation
export const addQuestionToExam = async (req, res) => {
 // console.log(req.body);
  const { examId, selectedQuestions } = req.body;
  const adminId=req.userId;
  //console.log(adminId);
  try {
    const checkValidUser=await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId}`);
    const checkQuestionEntry=await databaseQuery(`SELECT * FROM exam_questions_tbl WHERE exam_id=${examId}`)
    //console.log(checkValidUser);
    if(checkValidUser.length==0 || checkQuestionEntry.length>0){
      return res.json(responseObj('false',400,'Invalid user request'))
    }
    //console.log(checkValidUser);
    const insertExamQuestionQuery = "INSERT INTO exam_questions_tbl (exam_id,question_id,marks) VALUES (?,?,?)";
    
    for (let question of selectedQuestions) {
      await databaseQuery(insertExamQuestionQuery, [examId, question.questionId, question.marks])
    }
    var sumOfMarks = selectedQuestions.reduce((sum, obj) => sum + parseInt(obj.marks), 0);

    const addMarksOfExamQuery = "UPDATE exam_tbl SET total_marks=? WHERE exam_id=?"
    await databaseQuery(addMarksOfExamQuery, [sumOfMarks, examId]);


    res.json(responseObj('true', 200, "Questions selected successfully"))
  } catch (error) {
    console.log(error);

    res.json(responseObj('false', 500, "Something went wrong"))
  }
}