import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const getPreviewCurrentExamdata = async (req, res) => {
    const examId = req.body.examId;
    const adminId=req.userId;
   // console.log(examId);
    try {
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId} and (exam_start_datetime<=NOW() AND exam_end_datetime>=NOW())`);
        // console.log("valid user", checkValidUser);
         if (checkValidUser.length == 0) {
             return res.json(responseObj('false', 400, 'Invalid user request'))
         }
        let invitedCandidates = await databaseQuery(`SELECT student_id,first_name,last_name,email from students_tbl where student_id in (SELECT student_id from exam_student_tbl where exam_id=?)`, [examId])

        let activeCandidates = await databaseQuery(`SELECT student_id,first_name,last_name,email from students_tbl where student_id in(SELECT student_id FROM exam_attempts_tbl WHERE exam_id=?)`, [examId])

        let previewCurrentExamdata = {
            invitedStudents: invitedCandidates,
            activeCandidates: activeCandidates
        }
        res.json(responseObj('true', 200, "Sending Current Exams previewData", previewCurrentExamdata));
    }
    catch (error) {
        console.log(error);
        res.json(responseObj("false", 500, "something went wrong"))
    }

}