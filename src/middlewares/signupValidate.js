import { responseObj } from "../utils/responseObj.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection, databaseQuery } from "../database/databaseQuery.js";
import { jwtSignFn } from "../utils/jwt.js";

export async function signupValidate(req, res, next) {
  // console.log(req.body);

  const schema = Joi.object().keys({
    first_name: Joi.string().alphanum().min(4).max(50).required().messages({
      "string.empty": "First name cannot empty",
      "any.required": "First name is required ",
      "string.min": "First name must be at least 4 characters long",
      "string.max": "First name must not be more than 50 characters",
      'string.alphanum' : 'Only alphanumeric values are allowed'
    }),
    last_name: Joi.string().alphanum().min(4).max(50).required().messages({
      "string.empty": "Last name cannot empty",
      "any.required": "Last name is required ",
      "string.min": "Last name must be at least 4 characters long",
      "string.max": "Last name must not be more than 50 characters",
      'string.alphanum' : 'Only alphanumeric values are allowed'
    }),
    password: Joi.string().alphanum().min(3).max(20).required().messages({
      "string.empty": "Password cannot empty",
      "any.required": "Password is required ",
      "string.min": "Password must be at least 3 characters long",
      "string.max": "Password must not be more than 20 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email cannot empty",
      "any.required": "Email is required ",
    }),

    phone: Joi.string()
      .regex(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must have 10 digits.",
        "string.empty": "Phone cannot empty",
        "any.required": "Phone cannot empty",
      }),
  });
  let result = schema.validate(req.body, { abortEarly: false });
  if (result.error == null) {
    const [queryRes] = await databaseQuery(
      `select email from students_tbl where email='${req.body.email}'`
    );

    const [adminExists] = await databaseQuery(
      `select email from admins_tbl where email='${req.body.email}'`
    );

    // console.log(queryRes);
    if (queryRes || adminExists) {
      return res.status(402).json(responseObj(false, 402, "Email already exits"));
    }
    next();
  } else {
    console.log(result.error.details);
    return res.status(401).json(responseObj(false, 401, result.error.details));
  }
}
