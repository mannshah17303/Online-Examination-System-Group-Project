import { assessment_mark } from "../config/joiSchema.js";
import { databaseQuery } from "../database/databaseQuery.js";
import { responseObj } from "../utils/responseObj.js";

export async function assessmet_mid(req,res,next) {
    try{
        console.log(req.body);
        let obt_marks=0;
        for(let answer of req.body.stuMark){
            if(answer.mark>answer.max_mark){
                throw new Error("marks can't be grater then max marks")
            }
            const data=assessment_mark.validate({
                marks:answer.mark
            })
            obt_marks+=parseFloat(answer.mark);
        } 
        if(obt_marks>req.body.subjective_marks){
            throw new Error("mark can't be grater then marks of exam");
        }
        next();
    }catch(err){
        console.log("err",err);
        return res.status(403).json(responseObj(false, 403,err.message));
    }
}

