import { loginGet, loginPost } from "../../controllers/auth/login.js";
import express from "express";
import multer from "multer";
import { loginValidate } from "../../middlewares/loginValidate.js";
const upload = multer();

const router = express.Router();

router.get("/login", loginGet);
router.get("/superadmin/login",loginGet);
router.get("/admin/login",loginGet)
router.post("/api/auth/login/:role",upload.none(),loginValidate, loginPost);

export default router;
