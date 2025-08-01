import { responseObj } from "../utils/responseObj.js";
import Joi from "joi";

export async function loginValidate(req, res, next) {
  // console.log(req.body);
  const schema = Joi.object().keys({
    email: Joi.string().email().required().messages({
        "string.empty": "Email cannot empty",
        "any.required": "Email is required ",
    }),
    password: Joi.string().alphanum().min(3).max(20).required().messages({
      "string.empty": "Password cannot empty",
      "any.required": "Password is required ",
      'string.alphanum' : 'Only alphanumeric values are allowed'
    })
  });
  let result = schema.validate(req.body, { abortEarly: false });
  if (result.error == null) {
    next();
  } else {
    return res.status(401).json(responseObj(false, 401, result.error.details));
  }
}
