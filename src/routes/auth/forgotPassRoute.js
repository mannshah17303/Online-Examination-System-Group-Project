import express from "express";
import {
  forgotPass,
  forgotPassEmail,
  sendEmail,
  forgotPassPost,
} from "../../controllers/auth/forgotPass.js";
import multer from "multer";
import { forgotPassValidate } from "../../middlewares/forgotPassValidate.js";
const upload = multer();

const router = express.Router();

router.get("/forgot-pass/:token", forgotPass);
router.post(
  "/forgot-pass/:token",
  upload.none(),
  forgotPassValidate,
  forgotPassPost
);

router.post("/forgot-pass-email/:role", upload.none(), sendEmail);

router.get("/forgot-pass-email/:role", forgotPassEmail);

export default router;
