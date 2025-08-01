import express from "express";
import {
  assessListPage,
  assessStudentPage,
} from "../../../controllers/assess-page-controller.js";
const router = express.Router();

router.post("/admin/assessment", assessListPage);
router.post("/assessment/student/:assess", assessStudentPage);

export default router;
