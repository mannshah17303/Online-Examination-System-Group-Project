import jwt from "jsonwebtoken";
import { responseObj } from "../utils/responseObj.js";
import { databaseQuery } from "../database/databaseQuery.js";

/*

decoded userId will be accessed in backend with "req.userId".

*/

export const tokenVerificationForAdmin = (req, res, next) => {
  try {
    let token = req.cookies.token;

    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role == "admin" && decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.send(
        responseObj(
          false,
          400,
          "token validation failed try logging in again!!"
        )
      );
    }
  } catch (err) {
    console.log(err);

    res.send(
      responseObj(
        false,
        400,
        "You are not authorized try again by logging in!!"
      )
    );
  }
};

export const tokenVerificationForSuperAdmin = (req, res, next) => {
  try {
    let token = req.cookies.token;

    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role == "superadmin" && decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.send(
        responseObj(
          false,
          400,
          "token validation failed try logging in again!!"
        )
      );
    }
  } catch (err) {
    res.send(
      responseObj(
        false,
        400,
        "You are not authorized try again by logging in!!"
      )
    );
  }
};

export const tokenVerificationForStudent = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.role == "candidate" && decoded.userId) {
      req.userId = decoded.userId;

      let jwtTokenFromDatabase = await databaseQuery(`select jwt_token from user_token where student_id = ${decoded.userId}`);

      if (jwtTokenFromDatabase[0]['jwt_token'] == token){
        next();
      }
      else{
        res.send(responseObj(false, 400, 'Already logged in from another device'));
      }

    } else {
      res.send(
        responseObj(
          false,
          400,
          "token validation failed try logging in again!!"
        )
      );
    }
  } catch (err) {
    res.send(
      responseObj(
        false,
        400,
        "You are not authorized try again by logging in!!"
      )
    );
  }
};
