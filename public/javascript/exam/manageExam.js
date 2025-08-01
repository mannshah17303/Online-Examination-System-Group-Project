document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});

window.addEventListener("load", () => {
  search_box.value = ``;
  current.checked = true;
  getCurrent();
});
let exam = document.getElementById("exam");
let current = document.getElementById("current");
let upcoming = document.getElementById("upcoming");
let completed = document.getElementById("completed");
let search_box = document.getElementById("searchExam");
// document.getElementById('go_to_edit_exam').style.display = 'none'
// document.getElementById('marks').readOnly = true;
// document.getElementById('examId').readOnly = true;
document.getElementById("frm_examID").readOnly = true;
current.addEventListener("click", () => {
  search_box.value = ``;
  getCurrent();
});

upcoming.addEventListener("click", () => {
  search_box.value = ``;
  getUpcoming();
});

completed.addEventListener("click", () => {
  search_box.value = ``;
  getCompleted();
});

search_box.addEventListener("keyup", () => {
  if (current.checked) {
    // console.log("in get current");
    // console.log(search_box.value);
    getCurrent();
  } else if (upcoming.checked) {
    // console.log("in get upcoming");
    // console.log(search_box.value);
    getUpcoming();
  } else {
    // console.log("in get completed");
    // console.log(search_box.value);
    getCompleted();
  }
});

async function getCurrent() {
  exam.innerHTML = ``;
  const url = `/get-currentexams?like=${search_box.value}`;
  try {
    const response = await fetch(url);

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.status);
    }
    // let str = "";
    // console.log(json);
    if (json.data.length == 0) {
      exam.innerHTML = `Exam Not Found`;
      // str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Current Exam Not Found </div>`;
    } else {
      json.data.forEach((element) => {
        let exam_details = document.createElement("div");
        exam_details.className = "exam_details";
        exam_details.addEventListener("click", () => {
          gotoCurrentExam(element.exam_id);
        });
        const d =
          new Date(element.created_at).getDate() +
          "/" +
          (new Date(element.created_at).getMonth() + 1) +
          "/" +
          new Date(element.created_at).getFullYear();
        exam_details.innerHTML = `
                    <div class="first">
                        <span>Active</span>
                        
                        <p>Created : ${d}</p>
                    </div>
                    <div class="second">
                        <span>${element.exam_name}</span>
                        <p>2:30</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        <p>${element.total_marks} Marks</p>
                    </div>
                    <div class="four"> 
                        <span>Active Candidate : ${element.active_candidates}</span>
                        <p>Invited Candidate : ${element.total_candidates}</p>
                    </div>

`;
        exam.append(exam_details);
      });
    }
    // exam.innerHTML = str;
  } catch (error) {
    if (error.message == 400) {
      alert("Authentication failed");
      location.href = "/admin/login";
    }
    console.error(error.message);
  }
}

async function getUpcoming() {
  exam.innerHTML = ``;
  const url = `/get-upcomingexams?like=${search_box.value}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    // console.log(json);
    let str = "";
    if (json.data.length == 0) {
      exam.innerHTML = `Exam Not Found`;
      // str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Upcoming Exam Not Found </div>`;
    } else {
      json.data.forEach((element) => {
        let exam_details = document.createElement("div");
        exam_details.className = "exam_details";
        exam_details.addEventListener("click", () => {
          goToEditExam(element.exam_id, element.total_marks);
        });
        const marks = element.total_marks
          ? element.total_marks + " Marks"
          : "No Question Selected";
        const d =
          new Date(element.created_at).getDate() +
          "/" +
          (new Date(element.created_at).getMonth() + 1) +
          "/" +
          new Date(element.created_at).getFullYear();
        // exam_details.innerHTML  += `<div class="first">`;
        if (element.is_setup_done == 0) {
          exam_details.innerHTML += `<div class="first"><div style="width: 300px;display: flex"><span style="background-color: #f7bf0f;">Not Actived</span> <span style='width:180px; background-color: #077E8C'>Set Up in Progress</span></div><p>Created : ${d}</p></div>`;
        } else {
          exam_details.innerHTML += `<div class="first"><div style="width: 300px;display: flex"><span style="background-color: #f7bf0f;">Not Actived</span> <span style='width:180px; background-color: #00bf63 ;'>Set Up Done</span></div><p>Created : ${d}</p></div>`;
        }

        exam_details.innerHTML += `<div class="second">
                        <span>${element.exam_name}</span>
                        <p>2:30</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        
                        <p>${marks}</p>
                    </div>
                    <div class="four" style="justify-content: right; font-weight: bold; "> 
                        <p>Invited Candidate : ${element.total_candidates}</p>
                    </div>`;

        exam.append(exam_details);
      });
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function getCompleted() {
  exam.innerHTML = ``;
  const url = `/get-completedexams?like=${search_box.value}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    // console.log("competed");

    // console.log(json);

    if (json.data.length == 0) {
      // let exam_details=document.createElement('div')
      // exam_details.className=exam_details;
      // exam_details.innerHTML=`Completed Exam Not Found`
      // exam.appendChild(exam_details)
      exam.innerHTML = `Exam Not Found`;
    } else {
      json.data.forEach((element) => {
        let exam_details = document.createElement("div");
        exam_details.className = "exam_details";
        exam_details.addEventListener("click", () => {
          document.getElementById("frm_examID").value = element.exam_id;
          document.getElementById("go_to_assessment").submit();
        });
        const d =
          new Date(element.created_at).getDate() +
          "/" +
          (new Date(element.created_at).getMonth() + 1) +
          "/" +
          new Date(element.created_at).getFullYear();
        exam_details.innerHTML = `

                    <div class="first">
                        <span style="background-color: #304673;">Completed</span>
                        
                        <p>Created : ${d}</p>
                    </div>
                    <div class="second">
                        <span>${element.exam_name}</span>
                        <p>2:30</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        <p>${element.total_marks} Marks</p>
                    </div>
                    <div class="four"> 
                        <span>Active Candidate : ${element.appeared_candidates}</span>
                        <p>Invited Candidate : ${element.total_candidates}</p>
                    </div>`;
        exam.appendChild(exam_details);
      });
    }
  } catch (error) {
    // console.log(error);
    alert("something went wrong");
    return;
  }
}

// getCurrent()
// getUpcoming()
// getCompleted()

function goToExamAssessment(exam_id) {
  // console.log(exam_id);
  document.getElementById("frm_examID").value = exam_id;
  document.getElementById("go_to_assessment").submit();
}
function goToEditExam(examId, marks) {
  let form = document.createElement("form");
  form.action = "/edit-exam";
  form.method = "post";
  form.style.display = "none";

  let examIdInput = document.createElement("input");
  examIdInput.type = "text";
  examIdInput.name = "examId";
  examIdInput.value = examId;
  examIdInput.readOnly = true;

  let marksInput = document.createElement("input");
  marksInput.type = "text";
  marksInput.name = "marks";
  marksInput.value = marks;
  marksInput.readOnly = true;

  let submitButton = document.createElement("input");
  submitButton.type = "submit";
  submitButton.value = "Submit";

  form.appendChild(examIdInput);
  form.appendChild(marksInput);
  form.appendChild(submitButton);


  document.body.appendChild(form);

  form.submit();
  form.remove();
}
function gotoCurrentExam(examId) {

  let form = document.createElement("form");
  form.action = "/current-exam";
  form.method = "post";
  form.style.display = "none";

  let examIdInput = document.createElement("input");
  examIdInput.type = "text";
  examIdInput.name = "examId";
  examIdInput.value = examId;
  examIdInput.readOnly = true;

  let submitButton = document.createElement("input");
  submitButton.type = "submit";
  submitButton.value = "Submit";

  form.appendChild(examIdInput);
  form.appendChild(submitButton);

  document.body.appendChild(form);

  form.submit();
  form.remove();
}
