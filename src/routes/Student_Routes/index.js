//vidhi
import express from "express";
import startExamRoute from "./start.exam.route.js";
import dashboardRoute from "./student.dashboard.routes.js";
import examRoute from "./student.exam.routes.js";
import resultRoute from "./student.result.routes.js";

const router = express.Router();

router.use("/api/student/exam", examRoute);
router.use("/api/student/result", resultRoute);
router.use("/api/start-exam", startExamRoute);
router.use("/", dashboardRoute);

router.get("/student/manageExam", (req, res) => {
  res.render("studentExam/manageexam.ejs", {
    layout: "layouts/student-layout.ejs",
  });
});

router.get("/student/result", (req, res) => {
  res.render("studentResult/displayResult.ejs", {
    layout: "layouts/student-layout.ejs",
  });
});

router.post("/student/result/paper", (req, res) => {
  // console.log(req.body);

  const exam_id = req.body.exam_id;
  // console.log("exam id is", exam_id);
  res.render("studentResult/viewResult.ejs", {
    exam_id,
    layout: "layouts/student-layout.ejs",
  });
});

router.get("/student/dashboard", (req, res) => {
  res.render("studentDashboard/studentDashboard.ejs", {
    layout: "layouts/student-layout.ejs",
  });
});

export default router;
