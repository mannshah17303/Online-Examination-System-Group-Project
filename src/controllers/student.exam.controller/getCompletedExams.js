// import { databaseQuery } from "../../database/databaseQuery.js";

// export const getCompletedExams=async(req,res)=>{
    
//     const student_id = req.userId; 
//     console.log("in completed exams", student_id);

//     let CompletedExams=await databaseQuery(`SELECT * from exam_tbl E where exam_id in(select distinct exam_id from exam_batches_tbl where batch_id in(SELECT batch_id from batch_students_tbl where student_id =${student_id})) and NOW() > E.exam_end_datetime and E.is_setup_done = 1`)

//     res.send(CompletedExams)
    
// }

import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

//update query,res structure
export const getCompletedExams = async (req, res) => {
    try{     
        // const studentId = req.userId; // In production, get this from session
        
        // Modified query to include exams that have an attempt by this student
        // let completedExams = await databaseQuery(`
        //     SELECT E.* 
        //     FROM exam_tbl E 
        //     WHERE E.exam_id IN (
        //         -- Exams in the student's batches that have ended
        //         SELECT DISTINCT exam_id 
        //         FROM exam_batches_tbl 
        //         WHERE batch_id IN (
        //             SELECT batch_id 
        //             FROM batch_students_tbl 
        //             WHERE student_id = ?
        //         )
        //         AND NOW() > E.exam_end_datetime 
        //         AND E.is_setup_done = 1
        //     )
        //     OR E.exam_id IN (
        //         -- Exams that the student has attempted
        //         SELECT DISTINCT exam_id 
        //         FROM exam_attempts_tbl 
        //         WHERE student_id = ?
        //     )
        // `, [studentId, studentId]);
    
        // res.send(completedExams);
        let studentId=req.userId;
        let completedExams=await databaseQuery(`SELECT * FROM exam_tbl WHERE exam_id in (SELECT exam_student_tbl.exam_id FROM exam_student_tbl WHERE exam_student_tbl.student_id=${studentId} AND now()>exam_tbl.exam_end_datetime UNION SELECT exam_attempts_tbl.exam_id FROM exam_attempts_tbl WHERE exam_attempts_tbl.student_id=${studentId}) and is_setup_done = 1 and is_deleted = 0`)
        res.send(responseObj(true,200,"get completed exams list successfully",completedExams))
    }catch(err){
        console.log("err",err);
        res.send(responseObj(false,401,"get completed exams list failed"))
    }
}