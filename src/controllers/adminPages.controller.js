//admin page controller
export const adminProfilePage = (req, res) => {
  res.render("./profile/adminprofile.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
};

export const editAdminProfilePage = (req, res) => {
  res.render("./profile/editadminprofile.ejs", {
    layout: "layouts/admin-layout.ejs",
  });
};

//student page controller
export const studentProfilePage = (req, res) => {
  res.render("profile/studentprofile.ejs", {
    layout: "layouts/student-layout.ejs",
  });
};

export const editStudentProfile = (req, res) => {
  res.render("profile/editstudentprofile.ejs", {
    layout: "layouts/student-layout.ejs",
  });
};
