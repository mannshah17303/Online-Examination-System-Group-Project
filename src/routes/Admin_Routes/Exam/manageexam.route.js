import express from "express";
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";
import expressLayouts from "express-ejs-layouts";

let app = express();

let router = express();

router.get("/admin/manageExam", (req, res) => {
  res.render("exam/mangeexam.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
});
router.get("/admin/previewExam", (req, res) => {
  res.render("exam/previewExam.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
});

export default router;
