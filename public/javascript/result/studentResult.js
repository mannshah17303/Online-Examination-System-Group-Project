document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});

let studentData;
document.getElementById("frm_examId").readOnly = true;
document.getElementById("frm_studentId").readOnly = true;
async function getExamStudentData() {
  let examId = document.getElementById("examId").innerHTML;
  // console.log(examId);

  // console.log("getExamStudentData called");

  let res = await fetch("/api/result/get-exam-student-result", {
    headers: {
      "content-type": "application/json",
    },
    method: "post",
    body: JSON.stringify({ exam_id: examId }),
  });
  res = await res.json();
  let examdata = res.data.examData[0];
  // console.log(examdata);
  document.getElementById(
    "examData"
  ).innerHTML = `<h4>Exam name: ${examdata.exam_name}</h4><div><span><b>Total mark: </b>${examdata.total_marks}</span><span><b>Passing mark: </b>${examdata.passing_marks}</span>`;
  let data = res.data.studentData;
  // console.log(data);

  studentData = data;
  // console.log(studentData);
  // let table_head = `<tr>
  // <th>index</th>
  // <th>Name</th>
  // <th>email</th>
  // <th>Obtained mark</th>
  // <th>Status</th>
  //       </tr>`;
  let table_head = document.createElement("tr");
  table_head.innerHTML = `<th>index</th>
                <th>Name</th>
                <th>email</th>
                <th>Obtained mark</th>
                <th>Status</th>`;
  document.getElementById("get-student-data").appendChild(table_head);
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let table_data = document.createElement("tr");
      table_data.addEventListener("click", () => {
        document
          .getElementById("assess_paper")
          .setAttribute("action", `/assessment/student/view`);
        document.getElementById("frm_examId").value =
          document.getElementById("examId").innerHTML;
        document.getElementById("frm_studentId").value = data[i].student_id;
        document.getElementById("assess_paper").submit();
      });
      table_data.innerHTML = `
                  <td>${i + 1}</td>
                  <td>${data[i].first_name} ${data[i].last_name}</td>
                  <td>${data[i].email}</td>
                  <td>${data[i].obtained_marks}</td>
                  <td>${data[i].PassOrFail}</td>`;
      document.getElementById("get-student-data").appendChild(table_data);
    }
  } else {
    document.getElementById("get-student-data").innerHTML =
      "<p>No candidate found</p>";
  }
  // console.log(html);
}
getExamStudentData();
document.getElementById("search").addEventListener("keyup", () => {
  document.getElementById("get-student-data").innerHTML = ``;
  // console.log(studentData);

  let search = document.getElementById("search").value;
  // console.log(document.getElementById("search").value);

  let temp_data = studentData.filter((e) => e.email.includes(search));
  // console.log(data);
  let table_head = document.createElement("tr");
  table_head.innerHTML = `<th>index</th>
                <th>Name</th>
                <th>email</th>
                <th>Obtained mark</th>
                <th>Status</th>`;
  document.getElementById("get-student-data").appendChild(table_head);
  if (temp_data.length > 0) {
    // console.log(temp_data.length);
    
    for (let i = 0; i < temp_data.length; i++) {
      let table_data = document.createElement("tr");
      table_data.addEventListener("click", () => {
        document
          .getElementById("assess_paper")
          .setAttribute("action", `/assessment/student/view`);
        document.getElementById("frm_examId").value =
          document.getElementById("examId").innerHTML;
        document.getElementById("frm_studentId").value =
          temp_data[i].student_id;
        document.getElementById("assess_paper").submit();
      });
      table_data.innerHTML = `
                  <td>${i + 1}</td>
                  <td>${temp_data[i].first_name} ${temp_data[i].last_name}</td>
                  <td>${temp_data[i].email}</td>
                  <td>${temp_data[i].obtained_marks}</td>
                  <td>${temp_data[i].PassOrFail}</td>`;
      document.getElementById("get-student-data").appendChild(table_data);
    }
    // document.getElementById("all-data").style.overflowY =
    //   data.length > 3 ? "scroll" : "hidden";
  } else {
    document.getElementById("get-student-data").innerHTML =
      "<p>No candidate found</p>";
  }
  // console.log(html);
  // document.getElementById("get-student-data").innerHTML = html;
});
// function goToAssess(view, studentId) {

//   document
//     .getElementById("assess_paper")
//     .setAttribute("action", `/assessment/student/${view}`);
//   document.getElementById("frm_examId").value = document.getElementById('examId').innerHTML;
//   document.getElementById("frm_studentId").value = studentId;
//   document.getElementById("assess_paper").submit();
// }
