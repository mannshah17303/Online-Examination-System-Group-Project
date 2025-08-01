import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";


// fetch exam information for particular exam created by specific admin in fresh exam creation in final stage
export const fecthBasicDataForFinalCreate = async (req, res) => {
    const examId = req.query.examId;
    const adminId = req.userId
    try {
        //  const [validUser]=await databaseQuery(`SELECT created_by FROM exam_tbl WHERE exam_id=${examId}`);
        //  //console.log(validUser);
        // if(validUser.created_by!=adminId){
        //    return res.json(responseObj('false', 400, "Invalid user request"))
        // }
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId}`);
        if (checkValidUser.length == 0 ) {
            return res.json(responseObj('false', 400, 'Invalid user request'))
        }
        //category of selected question in exam
        let QuecategoriesOfcreatedExams = await databaseQuery(`SELECT category_name from category_tbl where category_id in(SELECT category_id from question_tbl where question_id in (SELECT question_id from exam_questions_tbl where exam_id=${examId}))`)

        //batch of admin
        let AllBatchesOfAdmin = await databaseQuery(`select * from batches_tbl where created_by=?`, [adminId])

        //basic information of exam
        let basicDataOfExam = await databaseQuery(`select * from exam_tbl where exam_id=?`, [examId])

        const ExamData = {
            basicDataOfExam: basicDataOfExam,
            AllBatchesOfAdmin: AllBatchesOfAdmin,
            QuecategoriesOfcreatedExams: QuecategoriesOfcreatedExams
        }

        res.send(responseObj("true", 200, "Data fetched successfully", ExamData));
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "something went wrong"))
    }



}
