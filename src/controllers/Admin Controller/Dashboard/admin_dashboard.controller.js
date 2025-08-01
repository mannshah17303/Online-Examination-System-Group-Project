import { responseObj } from '../../../utils/responseObj.js';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import os from "os";

import {
    Count_Total_Student,
    Count_Past_Exams,
    Count_Category,
    Count_Batch,
    get_Performance,
    get_Batch_Analysis,
    get_Setup_Deletion_Analysis,
    get_Engagement_Analysis,
    get_Exams,
    add_New_Admin_Records,
    checkEmailExists,
} from '../../../database/Admin Database Query/Category/dbQuery_category_query.js';

// Admin Dashboard
const Dashboard = (req, res) => {
    res.render("admin/dashboard", {
        title: "Dashboard",
        layout: "layouts/admin-layout.ejs",
    });
};

const Get_Total_Students = async (req, res) => {
    try {
        const admin_id = req.userId;
        const students = await Count_Total_Student(admin_id);
        res.json(responseObj(true, 200, "Successfully Loaded", students));
    } catch (error) {
        // console.error("Error fetching questions by category:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_Past_Exams = async (req, res) => {
    try {
        const admin_id = req.userId;
        const students = await Count_Past_Exams(admin_id);
        res.json(responseObj(true, 200, "Successfully Loaded", students));
    } catch (error) {
        // console.error("Error fetching questions by category:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_Category = async (req, res) => {
    try {
        const admin_id = req.userId;
        const students = await Count_Category(admin_id);
        res.json(responseObj(true, 200, "Successfully Loaded", students));
    } catch (error) {
        // console.error("Error fetching questions by category:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_Total_Batches = async (req, res) => {
    try {
        const admin_id = req.userId;
        const batch = await Count_Batch(admin_id);
        res.json(responseObj(true, 200, "Successfully Loaded", batch));
    } catch (error) {
        // console.error("Error fetching questions by category:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_fetchExams = async (req, res) => {
    try {
        const admin_id = req.userId;
        const batch = await get_Exams(admin_id);
        res.json(responseObj(true, 200, "Successfully Loaded", batch));
    }
    catch (error) {
        // console.error("Error fetching questions by category:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}

const Get_Student_Performance_Analysis = async (req, res) => {
    try {
        const admin_id = req.userId;
        const results = await get_Performance(admin_id);
        res.json(responseObj(true, 200, "Student performance analysis fetched successfully", results));
    } catch (error) {
        // console.error("Error fetching student performance analysis:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_Batch_Analysis = async (req, res) => {
    try {
        const admin_id = req.userId;
        const results = await get_Batch_Analysis(admin_id);
        res.json(responseObj(true, 200, "Batch analysis fetched successfully", results));
    } catch (error) {
        // console.error("Error fetching batch analysis:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_Setup_Deletion_Analysis = async (req, res) => {
    try {
        const admin_id = req.userId;
        const results = await get_Setup_Deletion_Analysis(admin_id);
        res.json(responseObj(true, 200, "Setup and deletion analysis fetched successfully", results));
    } catch (error) {
        // console.error("Error fetching setup and deletion analysis:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
const Get_Engagement_Analysis = async (req, res) => {
    try {
        const admin_id = req.userId;
        const results = await get_Engagement_Analysis(admin_id);
        res.json(responseObj(true, 200, "Engagement analysis fetched successfully", results));
    } catch (error) {
        // console.error("Error fetching engagement analysis:", error);
        res.json(responseObj(false, 500, "Internal Server Error"));
    }
}

// Admin Setup
const Setup_Page_Render = async (req, res) => {
    res.render("admin/setup_page", {
        title: "Setup Page",
        layout: false,
    });
}
const Get_Token_data = async (req, res) => {
    const { token } = req.body;
    // console.log("Token is ", token);

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // console.log("Decoded token is ", decoded);
            res.json(responseObj(true, 200, "Token Verified", decoded));
        } catch (error) {
            console.error("Token verification error: ", error);
            res.json(responseObj(false, 401, "Invalid or expired token"));
        }
    } else {
        res.json(responseObj(false, 400, "Token is required"));
    }
};
// const Add_Admin_Data = async (req, res) => {
//     try {
//         const {
//             first_name,
//             last_name,
//             email,
//             address,
//             dob,
//             mobile_number,
//             aadhar_number,
//             designation,
//             organization_name,
//             gender,
//             field_of_speciality,
//             confirm_password
//         } = req.body;
//         // Check if email already exists
//         const emailExists = await checkEmailExists(email);
//         if (emailExists) {
//             return res.json(responseObj(false, 409, "Email already exists in the system."));
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(confirm_password, 10);

//         // Add new admin record
//         const result = await add_New_Admin_Records(
//             first_name,
//             last_name,
//             email,
//             address,
//             dob,
//             mobile_number,
//             aadhar_number,
//             designation,
//             organization_name,
//             gender,
//             field_of_speciality,
//             hashedPassword
//         );

//         // Check if the admin was added successfully
//         if (result.affectedRows === 0) {
//             return res.json(responseObj(false, 400, "Admin could not be added."));
//         }

//         // Send verification email
//         await sendMailToAdmin(email);
//         return res.json(responseObj(true, 200, "Admin added successfully, verification email sent."));
//     } catch (error) {
//         console.error("Error adding new admin:", error);
//         if (!res.headersSent) {
//             return res.json(responseObj(false, 500, "Internal Server Error"));
//         }
//     }
// };
const Add_Admin_Data = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            address,
            dob,
            mobile_number,
            aadhar_number,
            designation,
            organization_name,
            gender,
            field_of_speciality,
            confirm_password
        } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !confirm_password) {
            return res.json(responseObj(false, 400, "Missing required fields: first_name, last_name, email, and password are required."));
        }

        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        console.log("Nishit:",  emailExists);
        if (emailExists) {
            return res.json(responseObj(false, 409, "This email is already registered in the system."));
        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(confirm_password, 10);

        // Add new admin record
        const result = await add_New_Admin_Records(
            first_name,
            last_name,
            email,
            address,
            dob,
            mobile_number,
            aadhar_number,
            designation,
            organization_name,
            gender,
            field_of_speciality,
            hashedPassword
        );

        // Check if the admin was added successfully
        if (result.affectedRows === 0) {
            return res.json(responseObj(false, 400, "Failed to add admin to the database."));
        }

        // Send verification email
        try {
            await sendMailToAdmin(email);
        } catch (emailError) {
            console.warn("Failed to send verification email:", emailError);
        }

        return res.json(responseObj(true, 200, "Error" , "Admin added successfully. Verification email sent."));
    } catch (error) {
        // console.error("Error adding new admin:", error);
        return res.json(responseObj(false, 500, "Error", "This email is registered as a student and cannot be used for an admin account"));
    }
};
export const sendMailToAdmin = async (to) => {

    const networkInterfaces = os.networkInterfaces();
        let serverIp = 'Unknown';
        for (const interfaceName in networkInterfaces) {
            const interfaces = networkInterfaces[interfaceName];
            for (const iface of interfaces) {
                // Skip loopback (localhost) and non-IPv4 addresses
                if (iface.family === 'IPv4' && !iface.internal) {
                    serverIp = iface.address;
                    break;
                }
            }
            if (serverIp !== 'Unknown') break;
        }
        const port = process.env.SERVER_PORT;

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

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Welcome to the Admin Panel',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Welcome to the Admin Panel</title>
            <style type="text/css">
                /* Reset default styles */
                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                body { margin: 0; padding: 0; width: 100% !important; font-family: 'Helvetica Neue', Arial, sans-serif; }
                
                /* Email wrapper */
                .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                
                /* Header */
                .header { background-color:rgb(0, 38, 255); padding: 20px; text-align: center; }
                .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
                
                /* Content */
                .content { padding: 30px 20px; color:rgb(81, 123, 214); }
                .content p { font-size: 16px; line-height: 1.6; margin: 0 0 15px; }
                .content strong { color: #304675; }
                
                /* Button */
                .button { display: inline-block; padding: 12px 24px; background-color: #304675; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
                .button:hover { background-color:rgb(42, 111, 185); }
                
                /* Footer */
                .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
                .footer p { margin: 0; line-height: 1.5; }
                
                /* Responsive */
                @media only screen and (max-width: 600px) {
                    .email-container { width: 100% !important; }
                    .content { padding: 20px !important; }
                    .button { width: 100%; text-align: center; }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="email-container">
                            <!-- Header -->
                            <tr>
                                <td class="header">
                                    <h1>Congratulations you are now Admin..!</h1>
                                </td>
                            </tr>
                            <!-- Content -->
                            <tr>
                                <td class="content">
                                    <p>Hello <strong>${to}</strong>,</p>
                                    <p>You have been added as an admin to the Admin Panel. To get started, please log in to your account.</p>
                                    <p style="text-align: center;">
                                        <a href="http://${serverIp}:${port}/admin/login" class="button">Login Here</a>
                                    </p>
                                    <p>Thank you for joining our team!</p>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td class="footer">
                                    <p>This email was sent to you because you have been added as an admin. If you believe this was a mistake or did not expect this email, please ignore it.</p>
                                    <p>&copy; ${new Date().getFullYear()} Admin Panel. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `,
    };

    // Send the email
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.error("Error sending email:", error);
                return reject(error);
            }
            // console.log("Email sent:", info.response);
            resolve(info);
        });
    });
};
const Render_Thankyou_Page = async (req, res) => {
    res.render("admin/thankyou", {
        title: "Thankyou Page",
        layout: false,
    });
}


export {
    Dashboard,
    Get_Total_Students,
    Get_Past_Exams,
    Get_Category,
    Get_Total_Batches,
    Get_Student_Performance_Analysis,
    Get_Batch_Analysis,
    Get_Setup_Deletion_Analysis,
    Get_Engagement_Analysis,
    Get_fetchExams,
    Setup_Page_Render,
    Get_Token_data,
    Add_Admin_Data,
    Render_Thankyou_Page,
}
