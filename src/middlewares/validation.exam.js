import { finalExamCreateSchema, initialExamCreateSchema, marksSchema } from "../config/joiSchema.js";
import { responseObj } from "../utils/responseObj.js";

// Validate information of the first stage of exam creation
export const initialExamCreateValidate = (req, res, next) => {
    const { exam_name, exam_description } = req.body;
    const data = initialExamCreateSchema.validate({
        examName: exam_name,
        examDescription: exam_description
    });
    if (data.error) {

        const message = data.error.details[0].message

        return res.json(responseObj('false', 400, message));
    } else {
        next();
    }
};

// Validate marks
export const marksValidate = (req, res, next) => {
    const { selectedQuestions } = req.body;
    if (selectedQuestions && selectedQuestions.length > 0) {
        for (let question of selectedQuestions) {
            const data = marksSchema.validate({
                marks: question.marks
            });
            if (data.error) {
                const message = data.error.details[0].message
                return res.json(responseObj('false', 400, message));
            }
        }
        next();
    } else {
        return res.json(responseObj('false', 400, 'Please select questions.'));
    }
};

// Validate the final stage of exam creation
export const finalExamCreateValidate = (req, res, next) => {

    const { examName, examDescription, duration, passingMarks, startTime, endTime, batchArray, studentArray, currentTime } = req.body;

    const data = finalExamCreateSchema.validate({
        examName: examName,
        examDescription: examDescription,
        passingMarks: passingMarks,
        startTime: startTime,
        endTime: endTime,
        duration: duration
    });

    if (data.error) {
        const message = data.error.details[0].message
        return res.json(responseObj('false', 400, message));
    } else if (new Date(startTime) > new Date(endTime)) {
        return res.json(responseObj('false', 400, 'Start time must be earlier than end time.'));
    } else if ((new Date(startTime).getTime()) < (currentTime + 300000) &&
        (new Date(endTime).getTime()) < (new Date(startTime).getTime() + 300000)) {
        return res.json(responseObj('false', 400, 'enter valid date and time also it must be 5 minute after current time'));
    } else if (isNaN(parseInt(duration))) {
        return res.json(responseObj('false', 400, 'Duration must be a valid number.'));
    } else if (batchArray.length == 0 && studentArray.length == 0) {
        return res.json(responseObj('false', 400, 'Select student or batch'));
    } else {
        next();
    }
};
export const finalExamEditValidate = (req, res, next) => {

    const { examName, examDescription, duration, passingMarks, startTime, endTime, currentTime } = req.body;
    //console.log(currentTime + 300000);
    //console.log(new Date(startTime).getTime());
    const data = finalExamCreateSchema.validate({
        examName: examName,
        examDescription: examDescription,
        passingMarks: passingMarks,
        startTime: startTime,
        endTime: endTime,
        duration: duration
    });
    console.log(typeof (batchArray));
    if (data.error) {
        const message = data.error.details[0].message
        return res.json(responseObj('false', 400, message));
    } else if (new Date(startTime) > new Date(endTime)) {
        return res.json(responseObj('false', 400, 'Start time must be earlier than end time.'));
    } else if ((new Date(startTime).getTime()) < (currentTime + 300000) &&
        (new Date(endTime).getTime()) < (new Date(startTime).getTime() + 300000)) {
        return res.json(responseObj('false', 400, 'enter valid date and time also it must be 5 minute after current time'));
    } else if (isNaN(parseInt(duration))) {
        return res.json(responseObj('false', 400, 'Duration must be a valid number.'));
    } else {
        next();
    }
};
