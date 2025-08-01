//vidhi
import express from "express";
import assessmentRoute from "./Assessment/assessment.route.js";
import assessmentPageRoute from "./Assessment/assessPage.route.js";
import batchRoute from "./Batch/batch.route.js";
import categoryRoute from "./Category/admin_category.routes.js";
import dashboardRoute from "./Dashboard/admin_dashboard.routes.js";
import examRoute from "./Exam/exam.routes.js";
import manageexamRoute from "./Exam/manageexam.route.js";
import questionRoute from "./Que_Ans/admin_quebank.routes.js";
import resultRoute from "./Result/resultRoute.js";

const router = express.Router();

router.use("/", resultRoute);
router.use("/", assessmentPageRoute);
router.use("/", assessmentRoute);
router.use("/", batchRoute);
router.use("/admin/category", categoryRoute);
router.use("/", dashboardRoute);
// router.use("/dashboard-admin", dashboardRoute);
router.use("/", examRoute);
// router.use("/", manageexamRoute);
router.use("/que-bank", questionRoute);

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
