import nodemailer from "nodemailer";
import { responseObj } from "../../utils/responseObj.js";
import Joi from "joi";
import os from "os";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getConnection, databaseQuery } from "../../database/databaseQuery.js";
import { jwtSignFn, jwtVerifyFn } from "../../utils/jwt.js";
import dotenv from "dotenv";
dotenv.config();
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

export async function signupGet(req, res) {
  try {
    res.render("./auth/Signup", { layout: false });
  } catch (error) {
    console.error(error);
  }
}

export async function verifyemail(req, res) {
  try {
    res.render("./auth/verifyemail", {
      token: `${req.params.token}`,
      layout: false,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function emailSend(req, res) {
  try {
    // console.log("in signup");
    
    let userExists = await databaseQuery(
      `select * from students_tbl where email = '${req.body.email}'`
    );

    if (Object.entries(userExists).length != 0) {
      res.send(responseObj(false, 400, "User already exists!!"));
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPwd;
      const token = await jwtSignFn(req.body, {
        expiresIn: "1h",
      });
      // const mailOptions = {
      //   from: "mankumar.ptl@gmail.com",
      //   to: `${req.body.email}`,
      //   subject: "Welcome to Online Examination System",
      //   html: `<div style="max-width: 100vw; margin: 10px;"><p>Dear ${req.body.first_name},</p>
      //   <p>Thank you for signing up with Us</p>
      //   <p>This link is only valid for 1 hr</p>
      //   <p>Please click the button given below to activate your account. </p>
      //   <a href="http://localhost:3000/verifyemail/${token}" style="padding: 10px; background-color: rgb(0, 182, 182); text-decoration: none; border-radius: 10px; color: white;">Activate Account</a>
      //   <br><br>
      //   <p>If the above method fails, you can try the URL given below in your browser. </p>
      //   <a href="http://localhost:3000/verifyemail/${token}" style="overflow-wrap:break-word ">http://localhost:3000/verifyemail/${token}</a>
      //   <br><p>We hope you have an enriching experience. </p>
      //   <p>Regards,</p>
      //   <p>OES Team</p></div>`,
      // };
      
      const mailOptions = {
        from: `${process.env.EMAIL_USER_NAME}`,
        to: `${req.body.email}`,
        subject: "Welcome to Online Examination System",
        html: `
        <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #eff6ff; border-radius: 8px; padding: 20px; box-shadow: 4px 4px 12px rgba(6,56,115,0.2); text-align: center;">
            <h2 style="color: #304673;">Welcome to Online Examination System</h2>
            <hr style="border: none; height: 1px; background-color: #304673;">
            <p style="font-size: 16px; color: #333;">Dear ${req.body.first_name},</p>
            <p style="font-size: 16px; color: #333;">Thank you for signing up with us!</p>
            <p style="font-size: 16px; color: #333;">This link is only valid for <b>1 hour</b>.</p>
            <p style="font-size: 16px; color: #333;">Click the button below to activate your account:</p>
            <div style="margin: 20px 0;">
                <a href="http://${getServerIp()}:${process.env.SERVER_PORT}/verifyemail/${token}" 
                    style="background-color: #304673; color: white; padding: 12px 20px; font-size: 16px; border-radius: 5px; text-decoration: none; font-weight: bold; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
                    Activate Account
                </a>
            </div>
            <p style="font-size: 16px; color: #333;">If the button does not work, copy and paste the link below into your browser:</p>
            <div style="word-wrap: break-word; padding: 10px; background-color: white; border-radius: 5px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
                <a href="http://${getServerIp()}:${process.env.SERVER_PORT}/verifyemail/${token}" style="color: #304673; text-decoration: none;">
                    http://${getServerIp()}:${process.env.SERVER_PORT}/verifyemail/${token}
                </a>
            </div>
            <br>
            <p style="font-size: 14px; color: #555;">We hope you have an enriching experience.</p>
            <hr style="border: none; height: 1px; background-color: #304673;">
            <p style="font-size: 14px; color: #555;">Regards,</p>
            <p style="font-size: 14px; color: #304673; font-weight: bold;">OES Team</p>
        </div>`,
      };
      await transporter.sendMail(mailOptions);

      // console.error("email sent: ");
      res.status(200).json(responseObj(true, 200, "Email sent"));
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json(responseObj(false, 400, "Email not sent"));
  }
}

export async function signupPost(req, res) {
  try {
    // console.log("in singup post");
    // const salt = await bcrypt.genSalt(10);
    // const hashedPwd = await bcrypt.hash(req.body.password, salt);
    const decode = await jwtVerifyFn(req.params.token);
    // console.log(decode);
    let candidate = await databaseQuery(
      `select email from students_tbl where email='${decode.email}'`
    );
    // console.log("candidate :", candidate);
    if (candidate.length > 0) {
      throw new Error("email already verified");
    } else {
      let insert_data = await databaseQuery(
        "insert into students_tbl (first_name,last_name,email,mobile_no,password) values (?,?,?,?,?)",
        [
          decode.first_name,
          decode.last_name,
          decode.email,
          decode.phone,
          decode.password,
        ]
      );
      const payload = {
        userId: insert_data.insertId,
        userName: decode.first_name + " " + decode.last_name,
        userEmail: decode.email,
        role: "candidate",
      };
      const token = await jwtSignFn(payload, {
        expiresIn: "6h",
      });

      let userTokenEntry = await databaseQuery(
        `insert into user_token (student_id, jwt_token) values (${insert_data.insertId}, '${token}')`
      );

      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        maxAge: 6 * 60 * 60 * 1000,
      });
      res.status(200).json(responseObj(true, 200, "Signup successfully done"));
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(responseObj(false, 400, "Signup failed"));
  }
}

export async function addAdmin(req, res) {
  try {
    // console.log("req.body: ", req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    return await databaseQuery(
      "insert into admins_tbl (first_name,last_name,email,password) values (?,?,?,?)",
      [req.body.first_name, req.body.last_name, req.body.email, hashedPwd]
    );
  } catch (error) {
    console.log(error);
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
