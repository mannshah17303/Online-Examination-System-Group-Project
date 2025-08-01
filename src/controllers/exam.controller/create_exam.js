import { databaseQuery } from "../../database/databaseQuery.js";
import { successfulMail } from "../../utils/mailSenderForNotification.js";
import { responseObj } from "../../utils/responseObj.js";

//initial stage of exam creration 
export const createExamstage1 = async (req, res) => {
    const { exam_name, exam_description } = req.body
    const admin_id = req.userId
    // console.log(req.body);

    try {
        const result = await databaseQuery(`INSERT INTO exam_tbl (exam_name,exam_description,created_by) VALUES (?,?,?)`, [`${exam_name}`, `${exam_description}`, `${admin_id}`])
        //console.log(result.insertId);
        res.json(responseObj('true', 200, "initial creation of exam successful", result.insertId));
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }
    // array of candidates mail



}

//final stage of fresh exam creation
export const createExamfinal = async (req, res) => {
    //console.log(req.body);
    try {
        const adminId = req.userId
        const { examName, examDescription, duration, passingMarks, startTime, endTime, examId, batchArray, studentArray } = req.body
        const studentsEmailArray = [];
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId}`);
        if (checkValidUser.length == 0) {
            return res.json(responseObj('false', 400, 'Invalid user request'))
        }
        await databaseQuery(`UPDATE exam_tbl SET exam_name=?,exam_description=?,duration=?,passing_marks=?,exam_start_datetime=?,exam_end_datetime=?,is_setup_done=1 where exam_id=?`, [examName, examDescription, duration, passingMarks, startTime, endTime, examId])

        // entry for batch bulk students
        for (let i = 0; i < batchArray.length; i++) {
            await databaseQuery(`INSERT IGNORE INTO exam_student_tbl (student_id,exam_id) SELECT student_id,? as exam_id from batch_students_tbl where batch_id =?`, [examId, batchArray[i]]);
        }
        for (let i = 0; i < batchArray.length; i++) {
            await databaseQuery(`INSERT INTO exam_batches_tbl (exam_id,batch_id) VALUES (?,?)`, [examId, batchArray[i]]);
        }
        // entry for  single student
        for (let i = 0; i < studentArray.length; i++) {
            await databaseQuery(`INSERT IGNORE into exam_student_tbl (exam_id,student_id) VALUES (?,?)`, [examId, studentArray[i]]);
        }

        let studentEmails = await databaseQuery(`select email from students_tbl where student_id in (select student_id from exam_student_tbl where exam_id=?)`, examId);
        let examData = await databaseQuery(`select exam_name,exam_start_datetime,exam_description from exam_tbl where exam_id=?`, examId)

        for (let i = 0; i < studentEmails.length; i++) {
            studentsEmailArray.push(studentEmails[i].email);
        }
        await successfulMail(studentsEmailArray, examData[0]);


        res.json(responseObj('true', 200, "final creation of exam successful", "null"))
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }


}


//check student is present in system or not in final exam creation stage
export const checkStudentExist = async (req, res) => {

    //console.log(req.body);
    const email = req.body.email;

    try {
        const result = await databaseQuery(`SELECT student_id FROM students_tbl WHERE email='${email}'`);
        //console.log(result);
        if (result.length > 0) {
            return res.json(responseObj('true', 200, 'student exist', result[0].student_id));

        } else {
            return res.json(responseObj('false', 400, 'student not exist'));
        }
    }
    catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }

}
