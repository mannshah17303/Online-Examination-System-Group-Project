import { responseObj } from '../utils/responseObj.js';
import Joi from 'joi';

export async function batchValidate(req, res, next) {
    try{
        const batchValidate = Joi.object({
            batchName : Joi.string().alphanum().required().messages({
                'string.empty': 'Batch name is required. ', 
                'string.alphanum' : 'Only alphanumeric values are allowed'
            })
        }).options({ abortEarly: true });
    
        const { error, value } = batchValidate.validate({batchName : req.body.batchName});
        if (error) {
            return res.send(responseObj(false, 401, error.details[0].message));
        } else {
            next();
        }
    }
    catch (err) {
        console.log(err);
    }
}