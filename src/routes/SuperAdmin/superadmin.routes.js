import express from "express"
import { Pass_Form_Data } from "../../middlewares/SuperAdmin_Middlewares/SuperAdmin_Middleware_Login_Multer.js"
import { verifyToken } from "../../middlewares/SuperAdmin_Middlewares/VerifyToken_Middleware.js";
import { validateProfile, validateNewAdmin } from '../../middlewares/SuperAdmin_Middlewares/validatorMiddleware.js'
import {
    SuperAdmin_Login_Page,
    Login_Request,
    Dashboard,
    Manage_Profile,
    Get_Profile_Data,
    Put_Profile_Data,
    Forgot_Password_Get,
    Forgot_Password_Post,
    resetPassword_Get,
    resetPassword_Post,
    Manage_Admin_Page,
    List_All_Admins,
    Deactivate_Admin,
    Deactivate_Admin_Email,
    Deactivate_Admin_Page,
    Deactivate_Admin_List,
    Activate_Admin,
    Delete_Admin,
    Add_Admin_Page,
    Get_New_Admin_Details,
    Site_UnderConstruction,
    Logout,
} from "../../controllers/SuperAdmin/superadmin.controller.js"

const router = express.Router()

router.get('/', SuperAdmin_Login_Page);
router.post('/login', Pass_Form_Data, Login_Request);
router.get('/dashboard', Dashboard);
router.get('/verify-token', verifyToken);


// Super Admin Profile Management
router.get('/manage-profile', Manage_Profile);
router.get('/profile/:adminId', Get_Profile_Data);
router.put('/profile/:adminId', Pass_Form_Data, validateProfile, Put_Profile_Data);


// Reset password Routes
router.get('/forgot-password', Forgot_Password_Get);
router.post('/forgot-password', Pass_Form_Data, Forgot_Password_Post);
router.get('/reset-password', resetPassword_Get);
router.post('/reset-password', resetPassword_Post);


// Admin (CRUD)
router.get('/manage-admins', Manage_Admin_Page);
router.get('/list-all-admins', List_All_Admins);
router.post('/deactivate-admin/:adminId', Deactivate_Admin);
router.post('/send-deactivation-email', Deactivate_Admin_Email);
router.get('/deactive-admins', Deactivate_Admin_Page);
router.get('/list-deactive-admins', Deactivate_Admin_List);
router.get('/activate-admin/:adminId', Activate_Admin);
router.delete('/delete-admin/:adminId', Delete_Admin);
router.get('/add-admin-page', Add_Admin_Page);
router.post('/send-admin-data', Pass_Form_Data, validateNewAdmin, Get_New_Admin_Details);
// router.get('/construction', Site_UnderConstruction);



// Logout Routes
router.get('/logout', Logout);

export default router;