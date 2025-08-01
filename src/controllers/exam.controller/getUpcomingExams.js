import { databaseQuery } from "../../database/databaseQuery.js"
import { responseObj } from "../../utils/responseObj.js";

export const getUpcomingExams = async (req, res) => {
    const adminId = req.userId;
    const search_box='%'+req.query.like+'%';
    // console.log(search_box);
    
    try {
        let upcomingExams = await databaseQuery(`SELECT * ,( SELECT count(*) from exam_student_tbl where exam_student_tbl.exam_id=E.exam_id) as total_candidates FROM exam_tbl E WHERE (E.exam_start_datetime > NOW() OR is_setup_done=0)  and created_by=? and E.is_deleted=0 and E.exam_name like ? ORDER BY E.exam_start_datetime ASC`, [adminId,search_box])

        res.json(responseObj('true', 200, "Sending Upcoming Exams", upcomingExams));

    } catch (error) {
        console.log(error)

        res.json(responseObj('false', 500, "Something went wrong"))
    }

}