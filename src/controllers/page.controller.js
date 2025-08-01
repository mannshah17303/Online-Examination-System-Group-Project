export const studentListPage = (req, res) => {
    const batchId = req.body.batchId;
    res.render("batch/student-list.ejs", { batchId, layout: "layouts/admin-layout.ejs" })
}
