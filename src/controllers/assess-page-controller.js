export const assessListPage = (req, res) => {
  const examId = req.body.examId;
  // console.log(examId);
  res.render("assessment/total-invited.ejs", {
    examId,
    layout: "layouts/admin-layout.ejs",
  });
};

export const assessStudentPage = (req, res) => {
  const studentId = req.body.student_id;
  const examId = req.body.exam_id;
  const assess = req.params.assess;
  res.render("assessment/assess-student.ejs", {
    studentId,
    examId,
    assess,
    layout: "layouts/admin-layout.ejs",
  });
};
