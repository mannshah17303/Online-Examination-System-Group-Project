import { responseObj } from "../utils/responseObj.js";
import Joi from "joi";

export async function forgotPassValidate(req, res, next) {
  // console.log(req.body);
  const schema = Joi.object().keys({
    password: Joi.string().alphanum().min(3).max(20).required().messages({
      "string.empty": "Password cannot empty",
      "any.required": "Password is required ",
      'string.alphanum' : 'Only alphanumeric values are allowed'
    }),
    retype : Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { "string.empty": "Confirm password cannot empty",
        "any.required": "Confirm Password is required ",
        "any.only": "Confirm Password must be match"} })

  });
  let result = schema.validate(req.body, { abortEarly: false });
  if (result.error == null) {
    next();
  } else {
    return res.status(401).json(responseObj(false, 401, result.error.details));
  }
}