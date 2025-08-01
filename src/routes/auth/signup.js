import { addAdmin, emailSend, signupGet, signupPost, verifyemail } from "../../controllers/auth/signup.js";
import {signupValidate} from '../../middlewares/signupValidate.js'
import express from "express";
import multer from "multer";
const upload = multer();

const router = express.Router();

router.get("/signup", signupGet);
router.get("/verifyemail/:token",verifyemail)
router.post("/verifyemail/:token",signupPost)
router.post("/api/auth/signup", upload.none(),signupValidate, emailSend);
router.post("/api/auth/admin/signup", upload.none(), addAdmin)

export default router;
