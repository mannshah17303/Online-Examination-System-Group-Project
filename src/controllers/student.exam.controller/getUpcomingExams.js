import { databaseQuery } from "../../database/databaseQuery.js"
import { responseObj } from "../../utils/responseObj.js";

export const getUpcomingExams=async(req,res)=>{
    // let upcomingExams=await databaseQuery(`SELECT * from exam_tbl E where exam_id in(select exam_id from batches_tbl where batch_id in(SELECT batch_id from batch_students_tbl where student_id =1)) and E.exam_start_datetime > NOW()`)

    // let upcomingExams=await databaseQuery(`SELECT * from exam_tbl E where exam_id in(select distinct exam_id from exam_batches_tbl where batch_id in(SELECT batch_id from batch_students_tbl where student_id =1)) and E.exam_start_datetime > NOW() and E.is_setup_done = 1`);
    try{
        //pending
        let studetId=req.userId;
        let upcomingExams=await databaseQuery (`SELECT * FROM exam_tbl WHERE exam_id in (SELECT exam_id FROM exam_student_tbl WHERE student_id=${studetId}) and now()<exam_start_datetime and is_setup_done=1 and is_deleted = 0`)
        res.send(responseObj(true,200,"get current exams list successfully",upcomingExams))
    }catch(err){
        console.log("err",err)
        res.send(responseObj(false,401,"get upcoming exams list failed"))
    }

}