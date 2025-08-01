import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const getCompletedExams = async (req, res) => {
    const adminId = req.userId;
    const search_box='%'+req.query.like+'%';
    try {
        let CompletedExams = await databaseQuery(
            `SELECT
            *,
            (
            SELECT
                COUNT(exam_student_tbl.student_id)
            FROM
                exam_student_tbl
            WHERE
                exam_student_tbl.exam_id IN(
                SELECT
                    exam_tbl.exam_id
                FROM
                    exam_tbl
                WHERE
                    exam_tbl.exam_id = E.exam_id and exam_tbl.created_by = ?
            ) 
        ) AS total_candidates,
        (
            SELECT
                COUNT(*)
            FROM
                exam_attempts_tbl
            WHERE
                exam_id = E.exam_id
        ) AS appeared_candidates
        FROM
            exam_tbl E
        WHERE
            exam_end_datetime < NOW() AND E.is_deleted=0 and created_by = ? and E.exam_name like ? ORDER BY E.exam_end_datetime ASC`,[adminId,adminId,search_box]
        );

        res.json(responseObj("true", 200, "Sending Completed Exams", CompletedExams));
    } catch (error) {
        console.log(error);
        res.json(responseObj("false", 500, "something went wrong"))
    }
};
