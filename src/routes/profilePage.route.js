import express from "express";
import { editAdminProfilePage, adminProfilePage, studentProfilePage, editStudentProfile } from "../controllers/adminPages.controller.js";
import { tokenVerificationForStudent, tokenVerificationForAdmin } from "../middlewares/token.verification.js";
const router = express.Router()


//admin pages routes
router.get("/admin/profile", adminProfilePage);
router.get("/admin/editProfile", tokenVerificationForAdmin, editAdminProfilePage);

//student pages routes
router.get('/student/profile', studentProfilePage);
router.get('/student/editprofile', tokenVerificationForStudent, editStudentProfile);

export default router