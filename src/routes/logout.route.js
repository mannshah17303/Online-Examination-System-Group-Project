import express from "express";
import { logout } from "../controllers/auth/logout.js";
import { tokenVerificationForStudent } from "../middlewares/token.verification.js";
import { responseObj } from "../utils/responseObj.js";
const router = express.Router();

router.post("/api/student/logout", tokenVerificationForStudent, logout);
router.get("/admin/logout", (req, res) => {
  // console.log("logout");

  res.clearCookie("token");
  res.status(200).json(responseObj(true, 200, "logout successfully"));
});

export default router;
