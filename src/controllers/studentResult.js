import { databaseQuery } from "../database/databaseQuery.js";

async function studentResult(req,res){
    try{
        let exam_id=req.body.exam_id;
        let examData=await databaseQuery(`select exam_id,exam_name,total_marks,passing_marks from exam_tbl where exam_id=${exam_id}`)
        // console.log(examData[0]);
        let studentData=await databaseQuery(`SELECT exam_attempts_tbl.student_id,students_tbl.full_name,exam_results_tbl.obtained_marks,CASE WHEN exam_results_tbl.obtained_marks>=${examData[0]["passing_marks"]} then "pass" ELSE "fail" end as PassOrFail from exam_attempts_tbl JOIN students_tbl on exam_attempts_tbl.student_id=students_tbl.student_id JOIN exam_results_tbl on exam_attempts_tbl.attempt_id=exam_results_tbl.attempt_id WHERE exam_attempts_tbl.exam_id=${exam_id}`);
        // console.log(studentData);
        res.send("done");
    }catch(err){
        console.log("err",err);
    }
    
}

export default studentResult;