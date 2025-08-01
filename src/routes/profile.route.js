import express from "express";
import { getAdminProfile, getStudentProfile, updateAdminProfile, updateStudentProfile } from "../controllers/profile.controller.js";
import { tokenVerificationForAdmin, tokenVerificationForStudent } from "../middlewares/token.verification.js";
const router = express.Router()

//Admin Profile api
router.get('/api/admin/profile', tokenVerificationForAdmin, getAdminProfile)
router.post('/api/admin/editprofile', tokenVerificationForAdmin, updateAdminProfile)

//Student Profile Api
router.get('/api/student/profile', tokenVerificationForStudent, getStudentProfile)
router.post('/api/student/editprofile', tokenVerificationForStudent, updateStudentProfile)

export default router