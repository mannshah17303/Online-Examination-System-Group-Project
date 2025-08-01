import { databaseQuery } from "../database/databaseQuery.js";

async function result(req,res){
    let examData=[];
    try{
        let created_by=req.body.created_by;
        let exams=await databaseQuery(`select exam_id from exam_tbl where created_by=${created_by}`);
        for await(const e of exams){
            let temp_data=await databaseQuery(`SELECT exam_id,exam_name,(SELECT COUNT(*) FROM exam_attempts_tbl WHERE exam_attempts_tbl.exam_id=${e.exam_id})as present_candidate,(SELECT COUNT(*)from batch_students_tbl WHERE batch_students_tbl.batch_id=(SELECT batch_id FROM exam_batches_tbl WHERE exam_id=${e.exam_id})) as invited_candidate,(SELECT count(*) from exam_results_tbl WHERE exam_results_tbl.obtained_marks>=(SELECT passing_marks FROM exam_tbl WHERE exam_id=${e.exam_id}) AND exam_results_tbl.attempt_id in (SELECT exam_attempts_tbl.attempt_id FROM exam_attempts_tbl WHERE exam_attempts_tbl.exam_id=${e.exam_id}))as pass_candidate from exam_tbl WHERE exam_id=${e.exam_id}`)
            // console.log(temp_data[0]);
            temp_data[0]["percentage"]=(temp_data[0]["pass_candidate"]/temp_data[0]["present_candidate"])*100;
            examData.push(temp_data[0]);
        }
        // console.log(exams);
        // console.log(examData);
        res.send("done");
    }catch(err){
        console.log("err",err);
        res.send(err);
    }
}
export default result;