import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const examDelete = async (req, res) => {
    const examId = req.body.examId;
    const adminId=req.userId;
    try {
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId}`);
        // console.log("valid user", checkValidUser);
         if (checkValidUser.length == 0) {
             return res.json(responseObj('false', 400, 'Invalid user request'))
         }
        await databaseQuery(`UPDATE exam_tbl SET is_deleted=1 WHERE exam_id=${examId}`)
        return res.json(responseObj('true', 200, 'Exam deleted successfully'));
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }
}