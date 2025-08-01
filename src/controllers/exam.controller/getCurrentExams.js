import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const getCurrentExams = async (req, res) => {
  const adminId = req.userId;
  const search_box = "%" + req.query.like + "%";
  try {
    let currentExams = await databaseQuery(
      `SELECT* ,( SELECT count(*) from exam_student_tbl where exam_student_tbl.exam_id=E.exam_id ) as total_candidates,(SELECT count(*) FROM exam_attempts_tbl WHERE exam_id=E.exam_id) as active_candidates FROM exam_tbl E WHERE NOW() BETWEEN exam_start_datetime and exam_end_datetime and created_by=? and exam_name like ? and is_deleted = 0 ORDER BY E.exam_start_datetime ASC`,
      [adminId, search_box]
    );

    res.json(responseObj("true", 200, "Sending Current Exams", currentExams));
  } catch (error) {
    console.log(error);
    res.json(responseObj("false", 500, "something went wrong"));
  }
};

export const getStudentRecordingsPage = (req, res) => {
  res.render("exam/student-recording", { layout: "layouts/admin-layout.ejs", examId: req.params.examId })
}

export const getStudentScreenPage = async (req, res) => {
  try {
    // const result = await databaseQuery(
    //   `select exam_id from exam_tbl where created_by = ${req.userId}`
    // );

    res.render("exam/screen-sharing", {
      layout: "layouts/admin-layout.ejs",
      adminId: req.userId,
      // examIds: result.map((e) => e.exam_id),
      examId: req.params.examId
    });
  } catch (error) {
    throw new Error(error);
  }
};

// export const 

export const getStudentRecordings = async (req, res) => {
  try {
    let result = await databaseQuery(`select st.student_id, concat_ws(' ', st.first_name, st.last_name) as full_name, st.email, srt.exam_id, srt.recording_url from exam_student_tbl est join students_tbl st on est.student_id = st.student_id join student_recording_tbl srt on est.student_id = srt.student_id where est.exam_id = ${req.body.examId} and srt.exam_id = ${req.body.examId};`);
    
    return res.status(200).json(responseObj(true, 200, "student recording fetched succesfully!", result))
  } catch (error) {
    return res.status(500).json(responseObj(false, 500, "Error while getting students recording!", error))
  }
}