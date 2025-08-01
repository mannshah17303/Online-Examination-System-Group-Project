import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const fetchQuestionsByCategory=async(req,res)=>{
    let categoryid=req.query.categoryid
    var questions=[];
    let results=await databaseQuery(`SELECT * from question_tbl where category_id=${categoryid}`)
    for(let i=0;i<results.length;i++){
        let allOptionsObjectArray=[]
        let options=await databaseQuery(`SELECT * FROM mcq_answers_tbl WHERE question_id=${results[i].question_id}`)    
        for(let j=0;j<options.length;j++){
           let optionsObject={
            optionId:options[j].answer_id,
            optionText:options[j].answer_text,
            isCorrect:options[j].is_correct
           }
           allOptionsObjectArray.push(optionsObject);
        }
        let tempQuestionObject={
            questionId:results[i].question_id,
            questionText:results[i].question_text,
            questionType:results[i].question_type,
            options:allOptionsObjectArray
          }
        questions.push(tempQuestionObject);

    }
    res.json(responseObj('true',200,"Sending questions by category",questions));    
    
}