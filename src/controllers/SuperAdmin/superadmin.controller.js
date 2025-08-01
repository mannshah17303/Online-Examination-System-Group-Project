import bcrypt from "bcrypt";
import os from "os";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// General Resosnse JSON
import {
    responseObj
} from '../../utils/responseObj.js';

// Database Query Files
import {
    check_Login_Credentials,
    updateUserPassword,
    get_UserAdmin_Data,
    update_UserAdmin_Data,
    getAdmins_List,
    deactivateAdmin,
    getDeactivatedAdmins_List,
    deleteAdmin,
    activateAdmin,
    // add_New_Admin_Records,
    check_Existing_Email
} from '../../database/SuperAdmin_Query/superadmin_query.js';


// Login Function
export const SuperAdmin_Login_Page = async (req, res) => {
    if (req.session.isSuperAdmin) {
        res.redirect('/super-admin/dashboard');
    }
    res.render('superadmin/superadmin_login_page', { msg: 'Super Admin Login', layout: false });
}
export const Login_Request = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await check_Login_Credentials(email);
        if (!user) {
            return res.json(responseObj(false, 401, "User Not Found"));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json(responseObj(false, 401, "Invalid Password"));
        }

        // Generate JWT Token
        const tokenPayload = {
            id: user.admin_id,
            email: user.email,
            firstName: user.first_name
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_SUPER_ADMIN, { expiresIn: '1h' });

        // Set session variables
        req.session.userId = user.admin_id;
        req.session.username = user.email;
        req.session.token = token;
        req.session.isSuperAdmin = true;

        return res.json(responseObj(true, 200, "Login Successful", token));

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json(responseObj(false, "Internal Server Error"));
    }
}

// Super-Admin Dashboard
export const Dashboard = async (req, res) => {
    if (req.session.isSuperAdmin) {
        res.render('superadmin/superadmin_dashboard', { msg: 'Super Admin Dashboard', layout: "layouts/superadmin_layouts.ejs" });
    } else {
        res.redirect('/super-admin');
    }
}


// Profile Management
export const Manage_Profile = async (req, res) => {
    if (req.session.isSuperAdmin) {
        const adminId = req.session.userId;
        res.render('superadmin/superadmin_manage_profile', { msg: 'Manage Profile', id: adminId, layout: "layouts/superadmin_layouts.ejs" });
    } else {
        res.redirect('/super-admin');
    }
}
export const Get_Profile_Data = async (req, res) => {
    if (!req.session.isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }
    const superAdminId = req.session.userId;
    try {
        const user = await get_UserAdmin_Data(superAdminId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        return res.status(200).json({ success: true, admin: user });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const Put_Profile_Data = async (req, res) => {
    if (!req.session.isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }
    const superAdminId = req.session.userId;
    const { firstName, lastName, email, address, dob, mobile_number, gender, role: roleInput } = req.body;
    let role = roleInput === 'Super-Admin' ? 1 : roleInput;
    try {
        const result = await update_UserAdmin_Data(superAdminId, firstName, lastName, email, address, dob, mobile_number, gender, role);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Super Admin not found or already deleted" });
        }
        return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating super admin profile:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

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

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER_NAME,
        pass: process.env.EMAIL_APP_PASS,
    },
});


// Reset Passsword Fuctions
export const Forgot_Password_Get = async (req, res) => {
    res.render('superadmin/superadmin_forgot_password', { msg: 'Forgot Password Page', layout: false });
}
export const Forgot_Password_Post = async (req, res) => {
    const { email } = req.body;

    // Input validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.json({
            success: false,
            status: 400,
            message: 'Invalid email address',
        });
    }

    try {
        // Check if the user exists
        const user = await check_Login_Credentials(email);
        if (!user) {
            return res.json(responseObj(false, 404, "Email not found"));
        }

        // Generate a one-time token
        const token = jwt.sign(
            { id: user.admin_id, email: user.email },
            process.env.JWT_SECRET_SUPER_ADMIN,
            { expiresIn: '1h' }
        );

        // Create a reset link
        const serverIp = getServerIp();
        const port = process.env.SERVER_PORT;
        const resetLink = `http://${serverIp}:${port}/super-admin/reset-password?token=${token}`;
        // console.log("Reset Link:", resetLink);

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: true,
            auth: {
                user: process.env.EMAIL_USER_NAME,
                pass: process.env.EMAIL_APP_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: `"Online Examination Portal" <${process.env.EMAIL_USER_NAME}>`,
            to: email,
            subject: 'Password Reset Request',
            text: `You have requested to reset your password. Please use the following link to reset it within the next 1 hour: ${resetLink}\n\nIf you did not request this, please ignore this email or contact support at nishitshiv2001@gmail.com.`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <title>Password Reset Request</title>
                    <style type="text/css">
                        /* Reset default styles */
                        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                        body { margin: 0; padding: 0; width: 100% !important; font-family: 'Helvetica Neue', Arial, sans-serif; }
                        
                        /* Email wrapper */
                        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                        
                        /* Header */
                        .header { background-color: #007bff; padding: 20px; text-align: center; }
                        .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
                        
                        /* Content */
                        .content { padding: 30px 20px; color: #333333; }
                        .content p { font-size: 16px; line-height: 1.6; margin: 0 0 15px; }
                        .content strong { color: #222222; }
                        
                        /* Button */
                        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
                        .button:hover { background-color: #0056b3; }
                        
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
                                            <h1>Password Reset Request</h1>
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td class="content">
                                            <p>Hello <strong>${email}</strong>,</p>
                                            <p>We received a request to reset the password for your Online Examination Portal account.</p>
                                            <p>Please click the button below to reset your password. This link is valid for the next 1 hour:</p>
                                            <p style="text-align: center; margin: 30px 0;">
                                                <a href="${resetLink}" class="button">Reset Your Password</a>
                                            </p>
                                            <p>If you did not request a password reset, please ignore this email or contact our support team at <a href="mailto:nishitshiv2001@gmail.com" style="color: #007bff;">nishitshiv2001@gmail.com</a>.</p>
                                            <p>Thank you,</p>
                                            <p>Online Examination Portal Team</p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td class="footer">
                                            <p>This is an automated email, please do not reply directly. For assistance, contact <a href="mailto:nishitshiv2001@gmail.com" style="color: #007bff;">nishitshiv2001@gmail.com</a>.</p>
                                            <p>© ${new Date().getFullYear()} Online Examination Portal. All rights reserved.</p>
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
        await transporter.sendMail(mailOptions);
        return res.json(responseObj(true, 200, "Password reset link sent to your email"));
    }
    catch (error) {
        return res.json(responseObj(false, 500, "Internal Server Error"));

    }
};
export const resetPassword_Get = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.json(responseObj(false, 400, "Token is required"));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET_SUPER_ADMIN);
        res.render('superadmin/superadmin_reset_password', { token, layout: false });
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(400).json(responseObj(false, 400, "Invalid or expired token"));
    }
};
export const resetPassword_Post = async (req, res) => {
    const { token, newPassword } = req.body;
    // console.log(req.body);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_SUPER_ADMIN);
        const userId = decoded.id;

        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(newPassword, salt);

        await updateUserPassword(userId, hashedPwd);

        return res.status(200).json(responseObj(true, 200, "Password has been reset successfully"));
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(400).json(responseObj(false, 400, "Invalid or expired token"));
    }
};


// Manage Admins
export const Manage_Admin_Page = async (req, res) => {
    if (req.session.isSuperAdmin) {
        res.render('superadmin/superadmin_manage_admins', { msg: 'Manage Admins', layout: "layouts/superadmin_layouts.ejs" });
    } else {
        res.redirect('/super-admin');
    }
};
export const List_All_Admins = async (req, res) => {
    try {
        const admins = await getAdmins_List();
        return res.json(responseObj(false, 400, "Successfully Fetched Admins List", admins));
    } catch (error) {
        console.error("Error Listing admins:", error);
        return res.json(responseObj(false, 400, "Error Listing admins"));
    }
}

// Deactivate Admin Functions
export const Deactivate_Admin = async (req, res) => {
    const { adminId } = req.params;
    // console.log(req.params);
    try {
        const deactivatedAdmin = await deactivateAdmin(adminId);
        return res.json(responseObj(true, 200, "Admin has been deactivated successfully", deactivatedAdmin));
    } catch (error) {
        return res.json(responseObj(false, 400, "Error deactivating admin"));
    }
}
export const Deactivate_Admin_Email = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    // Email options
    const mailOptions = {
        from: `"Online Examination Portal" <${process.env.EMAIL_USER_NAME}>`,
        to: email,
        subject: 'Account Deactivation Notice',
        text: `Dear Admin,\n\nYour admin account has been deactivated. If you believe this is a mistake, please contact our support team at nishitshiv2001@gmail.com.\n\nThank you for your understanding.\n\nBest regards,\nOnline Examination Portal`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>Account Deactivation Notice</title>
                <style type="text/css">
                    /* Reset default styles */
                    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                    body { margin: 0; padding: 0; width: 100% !important; font-family: 'Helvetica Neue', Arial, sans-serif; }
                    
                    /* Email wrapper */
                    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    
                    /* Header */
                    .header { background-color: #007bff; padding: 20px; text-align: center; }
                    .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
                    
                    /* Content */
                    .content { padding: 30px 20px; color: #333333; }
                    .content p { font-size: 16px; line-height: 1.6; margin: 0 0 15px; }
                    .content strong { color: #222222; }
                    
                    /* Button */
                    .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
                    .button:hover { background-color: #0056b3; }
                    
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
                                        <h1>Account Deactivation Notice</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td class="content">
                                        <p>Hello <strong>${email}</strong>,</p>
                                        <p>We regret to inform you that your admin account has been deactivated.</p>
                                        <p>If you believe this is a mistake or have any questions, please contact our support team:</p>
                                        <p style="text-align: center; margin: 20px 0;">
                                            <a href="mailto:nishitshiv2001@gmail.com" class="button">Contact Support</a>
                                        </p>
                                        <p>Thank you for your understanding.</p>
                                        <p>Best regards,<br>Online Examination Portal Team</p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td class="footer">
                                        <p>This is an automated email, please do not reply directly.</p>
                                        <p>© ${new Date().getFullYear()} Online Examination Portal. All rights reserved.</p>
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

    try {
        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Error sending email' });
    }
}
export const Deactivate_Admin_Page = async (req, res) => {
    if (req.session.isSuperAdmin) {
        res.render('superadmin/superadmin_deactive_admins', { msg: 'Manage Deactivation', layout: "layouts/superadmin_layouts.ejs" });
    } else {
        res.redirect('/super-admin');
    }
}

// List of Deactivate Admins
export const Deactivate_Admin_List = async (req, res) => {
    try {
        const deactivatedAdmins = await getDeactivatedAdmins_List();
        return res.json(responseObj(false, 400, "Successfully Fetched Deactivated Admins List", deactivatedAdmins));
    } catch (error) {
        return res.json(responseObj(false, 400, "Error Listing deactivated Admin"));
    }
}

// List of Activate Admins
export const Activate_Admin = async (req, res) => {
    const { adminId } = req.params;

    // Input validation
    if (!adminId || typeof adminId !== 'string') {
        return res.json(responseObj(false, 400, 'Invalid admin ID'));
    }

    try {
        // Activate the admin
        const activatedAdmin = await activateAdmin(adminId);
        if (!activatedAdmin || !activatedAdmin.result_email || !activatedAdmin.result_email[0]?.email) {
            return res.json(responseObj(false, 404, 'Admin not found or email unavailable'));
        }
        const admin_email = activatedAdmin.result_email[0].email;

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin_email)) {
            return res.json(responseObj(false, 400, 'Invalid admin email address'));
        }

        // Create login link
        const serverIp = getServerIp();
        const port = process.env.SERVER_PORT;
        const loginLink = `http://${serverIp}:${port}/admin/login`;

        // Email options
        const mailOptions = {
            from: `"Online Examination Portal" <${process.env.EMAIL_USER_NAME}>`,
            to: admin_email,
            subject: 'Account Activation Notice',
            text: `Dear Admin,\n\nYour admin account has been successfully activated. You can now log in to your account using the following link: ${loginLink}\n\nIf you believe this is a mistake, please contact our support team at nishitshiv2001@gmail.com.\n\nThank you!\n\nOnline Examination Portal`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <title>Account Activation Notice</title>
                    <style type="text/css">
                        /* Reset default styles */
                        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                        body { margin: 0; padding: 0; width: 100% !important; font-family: 'Helvetica Neue', Arial, sans-serif; }
                        
                        /* Email wrapper */
                        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                        
                        /* Header */
                        .header { background-color: #007bff; padding: 20px; text-align: center; }
                        .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
                        
                        /* Content */
                        .content { padding: 30px 20px; color: #333333; }
                        .content p { font-size: 16px; line-height: 1.6; margin: 0 0 15px; }
                        .content strong { color: #222222; }
                        
                        /* Button */
                        .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
                        .button:hover { background-color: #0056b3; }
                        
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
                                            <h1>Account Activation Notice</h1>
                                        </td>
                                    </tr>
                                    <!-- Content -->
                                    <tr>
                                        <td class="content">
                                            <p>Hello <strong>${admin_email}</strong>,</p>
                                            <p>Your admin account has been successfully activated.</p>
                                            <p>You can now log in to your account using the button below:</p>
                                            <p style="text-align: center; margin: 20px 0;">
                                                <a href="${loginLink}" class="button">Log In to Your Account</a>
                                            </p>
                                            <p>If you believe this is a mistake or have any questions, please contact our support team:</p>
                                            <p style="text-align: center; margin: 20px 0;">
                                                <a href="mailto:nishitshiv2001@gmail.com" class="button">Contact Support</a>
                                            </p>
                                            <p>Thank you!</p>
                                            <p>Best regards,<br>Online Examination Portal Team</p>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td class="footer">
                                            <p>This is an automated email, please do not reply directly. For assistance, contact:</p>
                                            <p>© ${new Date().getFullYear()} Online Examination Portal. All rights reserved.</p>
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

        await transporter.sendMail(mailOptions);
        return res.json(responseObj(true, 200, 'Admin has been activated successfully', activatedAdmin));
    } catch (error) {
        console.error('Error activating admin or sending email:', {
            message: error.message,
            stack: error.stack,
        });
        return res.json(responseObj(false, 400, 'Error activating admin'));
    }
};

// Function to Delete Admins
export const Delete_Admin = async (req, res) => {
    const { adminId } = req.params;
    try {
        const deletedAdmin = await deleteAdmin(adminId);
        return res.json(responseObj(true, 200, "Admin has been deleted successfully", deletedAdmin));
    } catch (error) {
        return res.json(responseObj(false, 400, "Error Deleteing Admin"));
    }
}

export const Add_Admin_Page = async (req, res) => {
    if (req.session.isSuperAdmin) {
        res.render('superadmin/superadmin_add_admin_page', { msg: 'Add Admin', layout: "layouts/superadmin_layouts.ejs" });
    } else {
        res.redirect('/super-admin');
    }
}

// Verifying Admin Details and Sending Email
export const Get_New_Admin_Details = async (req, res) => {
    if (!req.session.isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { f_name, l_name, email, mobile_number, gender, aadhar_number } = req.body;
    // console.log(req.body);
    try {
        const result = await check_Existing_Email(email);
        if (result.affectedRows === 0) {
            return res.json(responseObj(false, 404, "Admin already exists"));
        }
        // Token Creation
        const token = jwt.sign(
            { f_name, l_name, email, mobile_number, gender, aadhar_number },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        // console.log("Email Token :", token);
        // Sending Email
        const email_request = await sendMailToAdmin(email, token);
        return res.json(responseObj(true, 200, "Admin added successfully, email sent.", email_request));
    }
    catch (error) {
        console.error("Error adding new admin:", error);
        return res.json(responseObj(false, 500, "Internal Server Error"));
    }
}
export const sendMailToAdmin = async (to, token) => {
    // Input validation
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
        throw new Error('Invalid email address');
    }
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token');
    }

    // Create setup link
    const serverIp = getServerIp();
    const port = process.env.SERVER_PORT;
    const setupLink = `http://${serverIp}:${port}/admin-setup?token=${token}`;

    // Email options
    const mailOptions = {
        from: `"Online Examination Portal" <${process.env.EMAIL_USER_NAME}>`,
        to: to,
        subject: 'Welcome to the Admin Panel',
        text: `Dear Admin,\n\nYou have been added as an admin to the Online Examination Portal Admin Panel. To get started, please use the following link to set your password and complete your profile setup: ${setupLink}\n\nIf the link doesn’t work, copy and paste it into your browser.\n\nIf you believe this was a mistake, please contact our support team at nishitshiv2001@gmail.com.\n\nThank you for joining our team!\n\nBest regards,\nOnline Examination Portal`,
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
                    .header { background-color: #007bff; padding: 20px; text-align: center; }
                    .header h1 { color: #ffffff; font-size: 24px; margin: 0; }
                    
                    /* Content */
                    .content { padding: 30px 20px; color: #333333; }
                    .content p { font-size: 16px; line-height: 1.6; margin: 0 0 15px; }
                    .content strong { color: #222222; }
                    
                    /* Button */
                    .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
                    .button:hover { background-color: #0056b3; }
                    
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
                                        <h1>Welcome to the Admin Panel</h1>
                                    </td>
                                </tr>
                                <!-- Content -->
                                <tr>
                                    <td class="content">
                                        <p>Hello <strong>${to}</strong>,</p>
                                        <p>You have been added as an admin to the Online Examination Portal Admin Panel.</p>
                                        <p>To get started, please click the button below to set your password and complete your profile setup:</p>
                                        <p style="text-align: center; margin: 20px 0;">
                                            <a href="${setupLink}" class="button">Complete Setup</a>
                                        </p>
                                        <p>If you believe this was a mistake or have any questions, please contact our support team:</p>
                                        <p style="text-align: center; margin: 20px 0;">
                                            <a href="mailto:nishitshiv2001@gmail.com" class="button">Contact Support</a>
                                        </p>
                                        <p>Thank you for joining our team!</p>
                                        <p>Best regards,<br>Online Examination Portal Team</p>
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td class="footer">
                                        <p>This is an automated email, please do not reply directly. For assistance, contact:</p>
                                        <p>© ${new Date().getFullYear()} Online Examination Portal. All rights reserved.</p>
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
                console.error('Error sending admin onboarding email:', {
                    message: error.message,
                    stack: error.stack,
                });
                return reject(error);
            }
            // console.log('Email sent:', info.response);
            resolve(info);
        });
    });
};


export const Site_UnderConstruction = async (req, res) => {
    res.render('superadmin/superadmin_site_under_construction', { msg: 'Site Under Construction', layout: false });
}
export const Logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie(process.env.SESSION_COOKIE_NAME);
        return res.json(responseObj(true, 200, "Logout Successfully"));
    });
}