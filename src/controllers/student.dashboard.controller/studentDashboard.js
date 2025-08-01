import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const getStudentDashboardData=async(req,res)=>{
    // const {adminId}=req.query;
    // let {id}  = req.params
    // console.log(req.params.id)
    // console.log("user id is", req.userId);
    const student_id = req.userId;
    // console.log(req);
    
    try{
        let studentDashboardTable=await databaseQuery(`SELECT e.exam_id, e.exam_name,e.total_marks,e.passing_marks,exam_results_tbl.obtained_marks as score ,exam_results_tbl.result_date FROM exam_tbl e 
            JOIN exam_attempts_tbl ON exam_attempts_tbl.exam_id = e.exam_id
            JOIN exam_results_tbl ON exam_results_tbl.attempt_id = exam_attempts_tbl.attempt_id
            WHERE exam_attempts_tbl.student_id = ${student_id}
            ORDER BY e.exam_id DESC
            LIMIT 5`)
    
    
        let studentDashboard=await databaseQuery(`SELECT count(1) as total_exams from exam_attempts_tbl where student_id = ${student_id}`)
    
        let average_student_marks = await databaseQuery(`SELECT round(avg(exam_res.obtained_marks),2) as average_student_marks FROM exam_results_tbl exam_res join exam_attempts_tbl exam_att on exam_res.attempt_id = exam_att.attempt_id where exam_att.student_id = ${student_id} group by exam_att.student_id`)
    
        let pass_count = await databaseQuery(`SELECT exam_att.exam_id, examres.obtained_marks, exa.passing_marks FROM exam_attempts_tbl exam_att join exam_results_tbl examres on exam_att.attempt_id = examres.attempt_id join exam_tbl exa on exam_att.exam_id = exa.exam_id where exam_att.student_id = ${student_id} and examres.obtained_marks >= exa.passing_marks`);
    
        let fail_count = await databaseQuery(`SELECT exam_att.exam_id, examres.obtained_marks, exa.passing_marks FROM exam_attempts_tbl exam_att join exam_results_tbl examres on exam_att.attempt_id = examres.attempt_id join exam_tbl exa on exam_att.exam_id = exa.exam_id where exam_att.student_id = ${student_id} and examres.obtained_marks < exa.passing_marks`);
    

        let showChartQuery = await databaseQuery(`SELECT exam_att.exam_id, exam_res.obtained_marks, exam.total_marks, exam.exam_name from exam_attempts_tbl exam_att join exam_results_tbl exam_res on exam_att.attempt_id = exam_res.attempt_id join exam_tbl exam on exam.exam_id = exam_att.exam_id where exam_att.student_id = ${student_id}`)
    
        res.send(responseObj(true,200,"Dashboard data get successfully",{studentDashboard, average_student_marks, pass_count, fail_count, studentDashboardTable, showChartQuery}));
    }catch(err){
        console.log("err",err);
        
    }
    
}

