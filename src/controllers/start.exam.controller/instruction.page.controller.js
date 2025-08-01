import { responseObj } from "../../utils/responseObj.js";

export const instructionPage = async (req, res) => {
    try{
        let id = req.params.id;
        res.render('startExam/instructions.ejs', {layout : false, examId : id});
    }
    catch (err) {
        // console.log('error in instructionPage');
        // console.log(err);
        res.send(responseObj(false, 500, 'Error in getting instruction page'));
    }
}

// export const startExamBtnClicked = async (req, res) => {
//     try{
//         let examId = req.body.exam_id;
//         console.log(examId);
//     }
//     catch (err) {
//         console.log('error in startExamBtnClicked');
//         console.log(err);
//         res.send(responseObj(false, 500, 'Error in startExamBtnClicked'));
//     }
// }