import { databaseQuery } from "../../database/databaseQuery.js"
import { responseObj } from "../../utils/responseObj.js";


// get exam detail on select exam question on fresh exam creation
export const getExamDetail=async(req,res)=>{
    const examId=req.query.examId
 
    try {
        const examDetail=await databaseQuery(`SELECT *  FROM exam_tbl WHERE exam_id=${examId}`);
        
        res.json(responseObj('true',200,"Exam data ftched successfully",examDetail[0]));

    }catch (error) {
        console.log(error);
        res.json(responseObj("false", 500, "something went wrong"))
        
    }
}