import express from "express";
import {
  addStudent,
  deleteStudent,
  getAllStudents,
  addBatch,
  deleteBatch,
  editBatch,
  getAllBatches,
  displayPage,
  studentFileHandler,
} from "../../../controllers/batch.controller.js";
import upload from "../../../middlewares/multer.js";
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";
import { successfulMail } from "../../../utils/mailSenderForNotification.js";
import { studentListPage } from "../../../controllers/page.controller.js";
import { batchValidate } from "../../../middlewares/batch.validation.js";

const router = express.Router();

// routes for batches
router.get("/admin/batch", displayPage);
router.get("/api/batch/batch-list", tokenVerificationForAdmin, getAllBatches);
router.post("/api/batch/add-batch", tokenVerificationForAdmin, batchValidate, addBatch);
router.post("/api/batch/edit-batch", tokenVerificationForAdmin, batchValidate, editBatch);
router.post("/api/batch/delete-batch", tokenVerificationForAdmin, deleteBatch);

// routes for students in batch
router.post("/batch/students", studentListPage)
router.post("/api/batch/students", tokenVerificationForAdmin, getAllStudents);
router.post("/api/batch/add-student", tokenVerificationForAdmin, addStudent);
router.post("/api/batch/delete-student", tokenVerificationForAdmin, deleteStudent);
router.post("/api/batch/student-file", tokenVerificationForAdmin, upload.single("studentListFile"), studentFileHandler);
router.post("/api/batch/sendmail", successfulMail);
router.post('/sendmail', successfulMail);

export default router;
