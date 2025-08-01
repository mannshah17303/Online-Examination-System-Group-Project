import express from "express";
const router = express.Router();
import { ValidateAdminEntries } from "../../../middlewares/SuperAdmin_Middlewares/validatorMiddleware.js"
import { Pass_Form_Data } from "../../../middlewares/SuperAdmin_Middlewares/SuperAdmin_Middleware_Login_Multer.js"
import {
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
} from '../../../controllers/Admin Controller/Dashboard/admin_dashboard.controller.js';

import { tokenVerificationForAdmin } from '../../../middlewares/token.verification.js';

// Admin dashboard route
router.get("/dashboard-admin", Dashboard);
router.get("/total-students", tokenVerificationForAdmin, Get_Total_Students);
router.get("/past-exams", tokenVerificationForAdmin, Get_Past_Exams);
router.get("/que-category", tokenVerificationForAdmin, Get_Category);
router.get("/total-batch", tokenVerificationForAdmin, Get_Total_Batches);
router.get("/exams", tokenVerificationForAdmin, Get_fetchExams);
router.get("/student-appear-analysis", tokenVerificationForAdmin, Get_Student_Performance_Analysis);
router.get("/batch-analysis", tokenVerificationForAdmin, Get_Batch_Analysis);
router.get("/setup-deletion-analysis", tokenVerificationForAdmin, Get_Setup_Deletion_Analysis);
router.get("/engagement-analysis", tokenVerificationForAdmin, Get_Engagement_Analysis);

// Admin Setup
router.get("/admin-setup", Setup_Page_Render);
router.post("/decode-token", Get_Token_data);
router.post("/add-admin-data", Pass_Form_Data, ValidateAdminEntries, Add_Admin_Data);
router.get('/thankyou-page', Render_Thankyou_Page);
export default router;
