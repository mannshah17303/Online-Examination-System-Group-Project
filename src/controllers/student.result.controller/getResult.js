import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const getCompletedExams=async(req,res)=>{
    try{

        const student_id = req.userId;
        // console.log("in student get result", student_id);
    
        let CompletedExams=await databaseQuery(`SELECT distinct e.attempt_id, r.result_date, r.obtained_marks, exam.* from exam_attempts_tbl e left join exam_results_tbl r on e.attempt_id = r.attempt_id join exam_tbl exam on e.exam_id = exam.exam_id where e.student_id = ${student_id}`)
    
        res.send(responseObj(true,200,"get result list successfully",CompletedExams))
    }catch(err){
        res.send(responseObj(false,401,"get result list failed"))
    }
    
}