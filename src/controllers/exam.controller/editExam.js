import { databaseQuery } from "../../database/databaseQuery.js";
import { removedMail, successfulMail, timeStatusMail } from "../../utils/mailSenderForNotification.js";
import { responseObj } from "../../utils/responseObj.js";


// in edit exam question get all question of admin by category, get selected question of specific exam and  basic information of exam
export const getDataForEditExamQuestions = async (req, res) => {

    try {
        const requestTime = req.headers.requesttime;
       // console.log("request time", requestTime);
        let categoryId = req.query.categoryId;

        let questionType = req.query.questionType;

        const examId = req.query.examId;
       // console.log("in edit exam ",examId);
        var questions = [];  // array of all question

        var results = null;

        const adminId = req.userId

        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId} and (exam_start_datetime>NOW() OR exam_start_datetime is null)`);
       // console.log("valid user", checkValidUser);
        if (checkValidUser.length == 0) {
            return res.json(responseObj('false', 400, 'Invalid user request'))
        }
       // console.log("valid user", checkValidUser);
        // const examCreatedTime=checkValidUser[0].exam_start_datetime
        // if (checkValidUser[0].exam_start_datetime) {
        //     let tempIst = getISTTime(checkValidUser[0].exam_start_datetime);
        //     const examCreatedTime = new Date(tempIst).getTime();
        //     console.log("exam time", examCreatedTime);
        //     if (requestTime > examCreatedTime) {
        //         return res.json(responseObj('false', 400, 'This exam is not editable'))
        //     }
        // }


        // query to get question according to filter of question type and category 
        if (categoryId != 'all' && questionType != 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE category_tbl.category_id = ? 
                   AND question_tbl.question_type = ? 
                   AND category_tbl.created_by = ?`,
                [categoryId, questionType, adminId]
            );
        } else if (categoryId != 'all' && questionType == 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE category_tbl.category_id = ? 
                   AND category_tbl.created_by = ?`,
                [categoryId, adminId]
            );
        } else if (categoryId == 'all' && questionType != 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE question_tbl.question_type = ? 
                   AND category_tbl.created_by = ?`,
                [questionType, adminId]
            );
        } else if (categoryId == 'all' && questionType == 'all') {
            results = await databaseQuery(
                `SELECT * FROM question_tbl 
                 INNER JOIN category_tbl ON (question_tbl.category_id = category_tbl.category_id) 
                 WHERE category_tbl.created_by = ?`,
                [adminId]
            );
        }

        //console.log(results);

        //quesry execution of above quesry
        for (let i = 0; i < results.length; i++) {

            let allOptionsObjectArray = [];   //container array of option 

            let options = await databaseQuery(`SELECT * FROM mcq_answers_tbl WHERE question_id=${results[i].question_id}`) // fetch options of particular option

            for (let j = 0; j < options.length; j++) {
                let optionsObject = {
                    optionId: `${options[j].answer_id}`,
                    optionText: `${options[j].answer_text}`,
                    isCorrect: `${options[j].is_correct}`
                }
                allOptionsObjectArray.push(optionsObject);  // push option into question object
            }

            let tempQuestionObject = {
                questionId: results[i].question_id,
                questionText: results[i].question_text,
                questionType: results[i].question_type,
                options: allOptionsObjectArray
            }

            questions.push(tempQuestionObject); // push question into questions array

        }
        //selected question of exam
        let selectedQuestions = await databaseQuery(`SELECT question_id,marks from exam_questions_tbl where exam_id=?`, examId)

        //basic in formation of exam
        let examBasicData = await databaseQuery(`SELECT exam_name,total_marks,exam_description FROM exam_tbl where exam_id=? `, examId)


        // res.send(questions)
        res.json(responseObj("true", 200, "Exam selcted question data fetched", { questions, selectedQuestions, examBasicData }))
    } catch (error) {

        console.log(error);
        res.json(responseObj("false", 500, "something went wrong"));
    }

}

//handle edited question and make entry in database
export const editQuestionExam = async (req, res) => {
    // console.log(req.body);
    const { examId, selectedQuestions, removedArray } = req.body;
    const requestTime = req.headers.requesttime;
    const adminId=req.userId
    // console.log(typeof(selectedQuestions));

    try {
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId} and (exam_start_datetime>NOW() OR exam_start_datetime is null)`);
       // console.log("valid user", checkValidUser);
        if (checkValidUser.length == 0) {
            return res.json(responseObj('false', 400, 'Invalid user request'))
        }
        // if (checkValidUser[0].exam_start_datetime) {
        //     let tempIst = getISTTime(checkValidUser[0].exam_start_datetime);
        //     const examCreatedTime = new Date(tempIst).getTime();
        //     console.log("exam time", examCreatedTime);
        //     if (requestTime > examCreatedTime) {
        //         return res.json(responseObj('false', 400, 'This exam is not editable'))
        //     }
        // }
        //first remove question which is removed by user
        for (let i = 0; i < removedArray.length; i++) {
            await databaseQuery(`DELETE  FROM exam_questions_tbl WHERE exam_id=${examId} and question_id=${removedArray[i]}`)
        }

        // make entry of question of exam if question alredy in table it will be updated
        const insertExamQuestionQuery = " INSERT INTO exam_questions_tbl (exam_id,question_id,marks) VALUE(?,?,?) ON DUPLICATE KEY UPDATE marks=VALUES(marks)"
        for (let question of selectedQuestions) {
            await databaseQuery(insertExamQuestionQuery, [examId, question.questionId, question.marks])
        }

        //sum of total question marks
        var sumOfMarks = selectedQuestions.reduce((sum, obj) => sum + parseInt(obj.marks), 0);

        const addMarksOfExamQuery = "UPDATE exam_tbl SET total_marks=? WHERE exam_id=?"
        await databaseQuery(addMarksOfExamQuery, [sumOfMarks, examId]);


        res.json(responseObj('true', 200, "Questions selected successfully"))
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }
}


//get data in edit exam final stage 
export const getEditExamData = async (req, res) => {

    const examId = req.query.examId;
    //console.log("examId ",examId);
    const adminId = req.userId
    //console.log("adminId: ", adminId);
    const requestTime = req.headers.requesttime;
    try {
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId} and (exam_start_datetime>NOW() OR exam_start_datetime is null)`);
       // console.log("valid user", checkValidUser);
        if (checkValidUser.length == 0) {
            return res.json(responseObj('false', 400, 'Invalid user request'))
        }
       // console.log("valid user", checkValidUser);
        // const examCreatedTime=checkValidUser[0].exam_start_datetime
        // if (checkValidUser[0].exam_start_datetime) {
        //     let tempIst = getISTTime(checkValidUser[0].exam_start_datetime);
        //     const examCreatedTime = new Date(tempIst).getTime();
        //     console.log("exam time", examCreatedTime);
        //     if (requestTime > examCreatedTime) {
        //         return res.json(responseObj('false', 400, 'This exam is not editable'))
        //     }
        // }
        //selected question category
        let QuecategoriesOfcreatedExams = await databaseQuery(`SELECT category_name from category_tbl where category_id in(SELECT category_id from question_tbl where question_id in (SELECT question_id from exam_questions_tbl where exam_id=?))`, [examId])

        //All batch created by admin
        let AllBatchesOfAdmin = await databaseQuery(`select * from batches_tbl where created_by=?`, [adminId])

        //basic information of exam
        let basicDataOfExam = await databaseQuery(`select * from exam_tbl where exam_id=?`, [examId])

        //alredy selected student for exam
        let selectedStudents = await databaseQuery(`select * from students_tbl where student_id in (select student_id FROM exam_student_tbl where exam_id=?)`, [examId])

        //alredy selected batch in exam
        let selectedBatches = await databaseQuery(`select batch_id FROM exam_batches_tbl where exam_id=?`, [examId])
        // console.log(selectedBatches);

        const examData = {
            basicDataOfExam: basicDataOfExam,
            AllBatchesOfAdmin: AllBatchesOfAdmin,
            QuecategoriesOfcreatedExams: QuecategoriesOfcreatedExams,
            selectedStudents: selectedStudents || null,
            selectedBatches: selectedBatches || null
        }

        res.json(responseObj('true', 200, "Sending basicExamData", examData));
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }



}


//handle final submit requestion on exam edit final stage 
export const finalEditSubmit = async (req, res) => {
    //console.log(req.body);
    const newInsertedStudentMail = [];
    const removedStudentMail = [];
    const studentsEmailArray = [];
    const adminId=req.userId
    const { examName, examDescription, duration, passingMarks, startTime, endTime, examId, newStudentArray, batchArray, removeStudentArray } = req.body;
    const requestTime = req.headers.requesttime;
    try {
        const checkValidUser = await databaseQuery(`SELECT * FROM  exam_tbl WHERE exam_id=${examId} AND created_by=${adminId} and (exam_start_datetime>NOW() OR exam_start_datetime is null)`);
        if (checkValidUser.length == 0) {
            return res.json(responseObj('false', 400, 'Invalid user request'))
        }
        //console.log("valid user", checkValidUser);
        // const examCreatedTime=checkValidUser[0].exam_start_datetime
        // if (checkValidUser[0].exam_start_datetime) {
        //     let tempIst = getISTTime(checkValidUser[0].exam_start_datetime);
        //     const examCreatedTime = new Date(tempIst).getTime();
        //     console.log("exam time", examCreatedTime);
        //     if (requestTime > examCreatedTime) {
        //         return res.json(responseObj('false', 400, 'This exam is not editable'))
        //     }
        // }
        //console.log(newStudentArray);
       // console.log(removeStudentArray);
        let beforeInsertion = await databaseQuery(`SELECT student_id FROM exam_student_tbl WHERE exam_id=${examId}`);
        let beforeInsertionArray = beforeInsertion.map((obj) => obj.student_id);
        //console.log("before :",beforeInsertionArray);


        let [temptime] = await databaseQuery(`SELECT  exam_start_datetime FROM exam_tbl WHERE exam_id=${examId}`)
        //console.log(temptime);
        let tempIst = getISTTime(temptime.exam_start_datetime)
        const beforeUpdateTime = new Date(tempIst)
        //update basic information of exam


        await databaseQuery(`UPDATE exam_tbl SET exam_name=?,exam_description=?,duration=?,passing_marks=?,exam_start_datetime=?,exam_end_datetime=?,is_setup_done=1 where exam_id=?`, [examName, examDescription, duration, passingMarks, startTime, endTime, examId])

        //first remove studen which is removed by admin
        // for (let i = 0; i < removeStudentArray.length; i++) {
        //     await databaseQuery(`DELETE FROM exam_student_tbl WHERE student_id=? and exam_id=?`, [removeStudentArray[i], examId])
        // }
        //console.log(`DELETE FROM exam_student_tbl WHERE student_id IN (${removeStudentArray.join(",")}) and exam_id=${examId}`);
        if (removeStudentArray.length > 0) {
            await databaseQuery(`DELETE FROM exam_student_tbl WHERE student_id IN (${removeStudentArray.join(",")}) and exam_id=${examId}`)
        }

        //insert student in exam_student table which are present in batch selected by user


        for (let i = 0; i < batchArray.length; i++) {
            await databaseQuery(`INSERT IGNORE INTO exam_student_tbl (student_id,exam_id) SELECT student_id,? as exam_id from batch_students_tbl where batch_id =?`, [examId, batchArray[i]]);
        }
        //make entry of batch in exam_batch student
        for (let i = 0; i < batchArray.length; i++) {
            await databaseQuery(`INSERT IGNORE INTO exam_batches_tbl (exam_id,batch_id) VALUES (?,?)`, [examId, batchArray[i]]);
        }

        //make entry of new inserted student 
        for (let i = 0; i < newStudentArray.length; i++) {
            await databaseQuery(`INSERT IGNORE into exam_student_tbl (exam_id,student_id) VALUES (?,?)`, [examId, newStudentArray[i]]);
        }

        let newInsertion = await databaseQuery(`SELECT student_id FROM exam_student_tbl WHERE exam_id=${examId}`);

        let newInsertionArray = newInsertion.map((obj) => obj.student_id);
        // console.log("After :",newInsertionArray);
        const newInserted = newInsertionArray.filter(id => !beforeInsertionArray.includes(id));
        const removed = beforeInsertionArray.filter(id => !newInsertionArray.includes(id));
        // console.log("new inserted: ",newInserted);
       // console.log("removed :", removed);
        for (let i = 0; i < newInserted.length; i++) {
            const [result] = await databaseQuery(`SELECT email FROM students_tbl WHERE student_id =${newInserted[i]}`);
            newInsertedStudentMail.push(result.email)
        }
        //console.log("in mail", newInsertedStudentMail);
        for (let i = 0; i < removed.length; i++) {
            const [result] = await databaseQuery(`SELECT email FROM students_tbl WHERE student_id =${removed[i]}`);
            removedStudentMail.push(result.email)
        }
        // const studentIds = [...newInserted, ...removed];
        // console.log("studentid",studentIds);
        // if(newInserted.length>0 || removed.length>0){
        //     const query = `SELECT student_id, email FROM students_tbl WHERE student_id IN (${studentIds.join(",")})`;
        //     const results = await databaseQuery(query);

        //     const newInsertedStudentMail = [];
        //     const removedStudentMail = [];

        //     results.forEach(result => {
        //         if (newInserted.includes(result.student_id)) {
        //             newInsertedStudentMail.push(result.email);
        //         }
        //         if (removed.includes(result.student_id)) {
        //             removedStudentMail.push(result.email);
        //         }
        //     });
        // }

        let examData = await databaseQuery(`select exam_name,exam_start_datetime,exam_description from exam_tbl where exam_id=?`, examId);
        //console.log("insert mail", newInsertedStudentMail.length);

        ///console.log("remove mail", removedStudentMail.length);
        // console.log("");
        // console.log("successfull mail",newInsertedStudentMail);
        if (newInsertedStudentMail.length > 0) {
            await successfulMail(newInsertedStudentMail, examData[0]);
        }
        //console.log("removel mail",removedStudentMail);
        if (removedStudentMail.length > 0) {
            await removedMail(removedStudentMail, examData[0])
        }
        let studentEmails = await databaseQuery(`select email from students_tbl where student_id in (select student_id from exam_student_tbl where exam_id=?)`, examId);

        for (let i = 0; i < studentEmails.length; i++) {
            studentsEmailArray.push(studentEmails[i].email);
        }
        // console.log(new Date(startTime).getTime());
        // console.log(beforeUpdateTime.getTime());
        let newStartTime = new Date(startTime);
        //console.log("time change s ",studentsEmailArray);
        if ((beforeUpdateTime.getTime()) !== (newStartTime.getTime()) && studentEmails.length > 0) {
           // console.log('flase');
            await timeStatusMail(studentsEmailArray, examData[0]);
        }

        res.json(responseObj('true', 200, "final edition of exam successful"))
    } catch (error) {
        console.log(error);

        res.json(responseObj('false', 500, "Something went wrong"))
    }


}
function getISTTime(str) {
    let date = new Date(str)
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    let currentTimestamp = date.toISOString();

    let timestampDate = currentTimestamp.slice(0, 10);
    let currentHour = currentTimestamp.slice(11, 13);
    let currentMinute = currentTimestamp.slice(14, 16);
    let currentSecond = currentTimestamp.slice(17, 19);

    let time = currentHour + ":" + currentMinute + ":" + currentSecond;
    let timestampInIST = timestampDate + ' ' + time;

    return timestampInIST;
}
