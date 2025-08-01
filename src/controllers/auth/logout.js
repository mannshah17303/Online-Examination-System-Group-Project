import { databaseQuery } from "../../database/databaseQuery.js";
import { responseObj } from "../../utils/responseObj.js";

export const logout=async (req, res)=>{
    try{  
        let logout=await databaseQuery(`update log_history_tbl set is_login=0,logout_time=CURRENT_TIMESTAMP where student_id=${req.userId} and is_login=1 `)
        res.clearCookie("token");
        res.send(responseObj(true,200,"logout successfull"))
    }catch(err){
        console.log("err",err);
        
    }
}