import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const getCurrentExams=async(req,res)=>{
      // console.log("ip address: ", req.socket.remoteAddress)
      // console.log("ip address: ", req.connection.remoteAddress)
      // const {adminId}=req.query;
      
      // let currentExams=await databaseQuery(`SELECT *,(SELECT count(*) from batch_students_tbl where batch_id in (SELECT batch_id from exam_batches_tbl where exam_batches_tbl.exam_id=E.exam_id)) as total_candidates,(SELECT count(*) FROM exam_attempts_tbl WHERE exam_id=E.exam_id) as active_candidates FROM exam_tbl E WHERE NOW() BETWEEN exam_start_datetime and exam_end_datetime and created_by=8`)

      // res.send(currentExams);
      try{
            let studetId=req.userId;
            let currentExams=await databaseQuery(`SELECT * FROM exam_tbl WHERE exam_id in (SELECT exam_student_tbl.exam_id FROM exam_student_tbl WHERE exam_student_tbl.student_id=${studetId} and exam_id not in (SELECT exam_attempts_tbl.exam_id FROM exam_attempts_tbl WHERE exam_attempts_tbl.student_id=${studetId})) and now() BETWEEN exam_start_datetime and exam_end_datetime and is_setup_done = 1 and is_deleted = 0`)
            res.send(responseObj(true,200,"get current exams list successfully",currentExams))
      }catch(err){
            console.log("err",err);
            res.send(responseObj(false,401,"get current exams list failed"))
      }
}

// import { databaseQuery } from "../../database/databaseQuery.js";

// export const getCurrentExams = async (req, res) => {
//     const { adminId } = req.query;
//     const studentId = 1; // In production, get this from session
    
//     let currentExams = await databaseQuery(`
//         SELECT E.*,
//             (SELECT count(*) from batch_students_tbl 
//              WHERE batch_id IN (SELECT batch_id from exam_batches_tbl 
//                                WHERE exam_batches_tbl.exam_id=E.exam_id)) as total_candidates,
//             (SELECT count(*) FROM exam_attempts_tbl 
//              WHERE exam_id=E.exam_id) as active_candidates 
//         FROM exam_tbl E 
//         WHERE NOW() BETWEEN exam_start_datetime AND exam_end_datetime
//         AND E.exam_id IN (
//             SELECT DISTINCT exam_id 
//             FROM exam_batches_tbl 
//             WHERE batch_id IN (
//                 SELECT batch_id 
//                 FROM batch_students_tbl 
//                 WHERE student_id = ?
//             )
//         )
//         AND E.exam_id NOT IN (
//             -- Exclude exams the student has already attempted
//             SELECT exam_id 
//             FROM exam_attempts_tbl 
//             WHERE student_id = ?
//         )
//         AND E.is_setup_done = 1
//     `, [studentId, studentId]);

//     res.send(currentExams);
// }