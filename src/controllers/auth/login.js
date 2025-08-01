import { responseObj } from "../../utils/responseObj.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection, databaseQuery } from "../../database/databaseQuery.js";
import { jwtSignFn } from "../../utils/jwt.js";

export async function loginGet(req, res) {
  try {
    res.render("./auth/Login", { layout: false });
  } catch (error) {
    console.error(error);
  }
}

export async function loginPost(req, res) {
  // console.log("in login");
  let role = req.params.role;
  // console.log(role);

  // console.log(req.body);

  try {
    let [result] = [];
    if (role == "admin") {
      [result] = await databaseQuery(
        `select admin_id as id,first_name,last_name,email,password,role from admins_tbl where email = '${req.body.email}' and role=0 and is_deleted = 0`
      );
    } else if (role == "superadmin") {
      [result] = await databaseQuery(
        `select admin_id as id,first_name,last_name,email,password,role from admins_tbl where email = '${req.body.email}' and role = 1`
      );
    } else {
      [result] = await databaseQuery(
        `select student_id as id,first_name,last_name,email,password from students_tbl where email = '${req.body.email}'`
      );
    }
    // console.log(result);
    if (result) {
      let pwd = result.password;
      let userId = result.id;
      let userName = result.first_name + " " + result.last_name;
      let userEmail = result.email;
      const pwdMatch = await bcrypt.compare(req.body.password, pwd);
      if (!pwdMatch) {
        // console.log("password not match");

        return res
          .status(401)
          .json(responseObj(false, 401, "Authentication failed"));
      }
      if (role == "candidate") {
        // let [checkLoged] = await databaseQuery(
        //   `select is_login from log_history_tbl where student_id = ${userId} `
        // );
        // console.log(checkLoged);

        // if (checkLoged) {
          let [checkLoged2] = await databaseQuery(
            `select * from log_history_tbl where student_id = ${userId} and is_login = 1`
          );
          // console.log("in check log in");

          // console.log(checkLoged2);
          if (checkLoged2) {
            // if (checkLoged2.is_logi) {
              await databaseQuery(
                `update log_history_tbl set is_login=0,logout_time=CURRENT_TIMESTAMP where student_id=${userId} and is_login=1`
              );
              await databaseQuery(
                `insert into log_history_tbl (student_id,is_login) values (?,?)`,
                [userId, 1]
              );
            // }
          } else {
            await databaseQuery(
              `insert into log_history_tbl (student_id,is_login) values (?,?)`,
              [userId, 1]
            );
          }
        // } else {
        //   await databaseQuery(
        //     `insert into log_history_tbl (student_id,is_login) values (?,?)`,
        //     [userId, 1]
        //   );
        // }
      }
      const payload = {
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        role: role,
      };
      // console.log(payload);
      const token = await jwtSignFn(payload, {
        expiresIn: "6h",
      });
      let data = {
        token: token,
        id: result.id,
      };
      // console.log(result.id);

      if (role == "candidate") {
        let updateExistingToken = await databaseQuery(`update user_token set jwt_token = '${token}' where student_id = ${userId}`);
      }

      if (role != "candidate") {
        // data["admin_id"] = result.id;
        data["role"] = role;
      }
      // console.log(token);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 6 * 60 * 60 * 1000,
      });
      // console.log(data);

      const getRes = responseObj(true, 200, "login successfully", role);
      return res.status(200).json(getRes);
    } else {
      const getRes = responseObj(false, 401, "Authentication failed");
      return res.status(401).json(getRes);
    }
  } catch (error) {
    console.error(error);
    const getRes = responseObj(false, 401, "Authentication failed");
    return res.status(401).json(getRes);
  }
}
