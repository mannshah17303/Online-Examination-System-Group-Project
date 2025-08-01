import { responseObj } from "../../utils/responseObj.js";
import nodemailer from "nodemailer";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import os from "os";
import { getConnection, databaseQuery } from "../../database/databaseQuery.js";
import { jwtSignFn, jwtVerifyFn } from "../../utils/jwt.js";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER_NAME,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export async function forgotPass(req, res) {
  let token = req.params.token;
  let flag;
  let [check] = await databaseQuery(
    `select jwt_token from forgot_pass_tbl where jwt_token = '${token}'`
  );
  // console.log(check);
  if (check) {
    flag = 1;
  } else {
    flag = 0;
  }
  // console.log(flag);

  res.render("./auth/ForgotPass", {
    token: `${req.params.token}`,
    flag: flag,
    layout: false,
  });
}

export async function forgotPassPost(req, res) {
  try {
    let token = req.params.token;
    let password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    let retype = req.body.retype;
    if (password.length < 0 || retype.length < 0 || password !== retype) {
      // console.log("password not match");

      res.status(402).json(responseObj(false, 402, "Password not match"));
    } else {
      // console.log(token);

      let decode = await jwtVerifyFn(token);
      if (decode.role == "candidate") {
        await databaseQuery(
          `update students_tbl set password = '${hashedPwd}' where email = '${decode.email}'`
        );
      } else {
        await databaseQuery(
          `update admins_tbl set password = '${hashedPwd}' where email = '${decode.email}'`
        );
      }
      await databaseQuery(
        `delete from forgot_pass_tbl where jwt_token = '${token}'`
      );
      res
        .status(200)
        .json(responseObj(true, 200, "password set successsfully"));
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json(responseObj(false, 400, "password not set successsfully"));
  }
}

export async function forgotPassEmail(req, res) {
  res.render("./auth/ForgotPassEmail", { layout: false });
}

export async function sendEmail(req, res) {
  try {
    let email = req.body.email;
    // console.log("in send email for forgot password");

    let role = req.params.role;
    let [result] = [];
    if (role !== "candidate") {
      [result] = await databaseQuery(
        `select first_name,email from admins_tbl where email = '${email}'`
      );
    } else {
      [result] = await databaseQuery(
        `select first_name,email from students_tbl where email = '${email}'`
      );
    }
    req.body["role"] = role;
    // console.log(result);
    if (result) {
      const token = await jwtSignFn(req.body, {
        expiresIn: "24h",
      });
      // const mailOptions = {
      //   from: "mankumar.ptl@gmail.com",
      //   to: `${email}`,
      //   subject: "Online Examination System Password Assistance",
      //   html: ` <div style="max-width: 100vw; margin: 10px;"><p>Dear ${result.first_name},</p>
      //   <p style="overflow-wrap:break-word ">Please click the button given below to reset your password. Please note that the link will remain valid for 24 hrs only from this password request mail. </p>
      //   <a href="http://localhost:3000/forgot-pass/${token}" style="padding: 10px; background-color: rgb(0, 182, 182); text-decoration: none; border-radius: 10px; color: white;">Set Password</a>
      //   <br><br>
      //   <p>If the above method fails, you can try the URL given below in your browser. </p>
      //   <a href="http://localhost:3000/forgot-pass/${token}" style="overflow-wrap:break-word ">http://localhost:3000/forgot-pass/${token}</a>
      //   <br><p style="overflow-wrap:break-word ">Please ignore this email if you did not request help with your password. Your current password will remain unchanged.  </p>
      //   <p>Regards,</p>
      //   <p>OES Team</p></div>`,
      // };
      const mailOptions = {
        from: `${process.env.EMAIL_USER_NAME}`,
        to: `${email}`,
        subject: "🔑 Online Examination System Password Assistance",
        html: `
        <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #eff6ff; border-radius: 8px; padding: 20px; box-shadow: 4px 4px 12px rgba(6,56,115,0.2); text-align: center;">
            <h2 style="color: #304673;">Reset Your Password</h2>
            <hr style="border: none; height: 1px; background-color: #304673;">
            <p style="font-size: 16px; color: #333;">Dear ${result.first_name},</p>
            <p style="font-size: 16px; color: #333;">
                Click the button below to reset your password.  
                <b>This link will expire in 24 hours.</b>
            </p>
            <div style="margin: 20px 0;">
                <a href="http://${getServerIp()}:${process.env.SERVER_PORT}/forgot-pass/${token}" 
                    style="background-color: #304673; color: white; padding: 12px 20px; font-size: 16px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
                    Set Password
                </a>
            </div>
            <p style="font-size: 16px; color: #333;">
                If the button does not work, copy and paste the link below into your browser:
            </p>
            <div style="word-wrap: break-word; padding: 10px; background-color: white; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
                <a href="http://${getServerIp()}:${process.env.SERVER_PORT}/forgot-pass/${token}" style="color: #304673; text-decoration: none;">
                    http://${getServerIp()}:${process.env.SERVER_PORT}/forgot-pass/${token}
                </a>
            </div>
            <br>
            <p style="font-size: 14px; color: #555;">
                If you did not request a password reset, you can safely ignore this email—your current password will remain unchanged.
            </p>
            <hr style="border: none; height: 1px; background-color: #304673;">
            <p style="font-size: 14px; color: #555;">Regards,</p>
            <p style="font-size: 14px; color: #304673; font-weight: bold;">Online Examination System Team</p>
        </div>`,
      };

      await transporter.sendMail(mailOptions);
      await databaseQuery(
        `insert into forgot_pass_tbl (jwt_token) values (?)`,
        [token]
      );
      res.status(200).json(responseObj(true, 200, "mail sent successfully"));
    } else {
      res.status(401).json(responseObj(false, 402, "account doesn't exsist"));
    }
  } catch (error) {
    console.log(error);
    res.status(401).json(responseObj(false, 401, "Authentication failed"));
  }
}

// Geting the IP address of the Running Server
const getServerIp = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
              return iface.address;
          }
      }
  }
  return 'localhost';
};