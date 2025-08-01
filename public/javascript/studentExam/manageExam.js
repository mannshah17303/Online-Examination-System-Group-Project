let exam = document.getElementById("exam");
let current = document.getElementById("current");
let upcoming = document.getElementById("upcoming");
let completed = document.getElementById("completed");
document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});
current.addEventListener("click", () => {
  getCurrent();
});

upcoming.addEventListener("click", () => {
  getUpcoming();
});

completed.addEventListener("click", () => {
  getCompleted();
});

async function getCurrent() {
  if (current.checked) {
    const url = "/api/student/exam/get-currentexams";
    try {
      const response = await fetch(url);
      let json = await response.json();
      if (!json.success) {
        throw new Error(json.status);
      }

      json = json.data;
      let str = "";
      if (json.length == 0) {
        str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Current Exam Not Found </div>`;
      } else {
        json = json.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        json.forEach((element) => {
          const d =
            new Date(element.exam_start_datetime).getDate() +
            "/" +
            (new Date(element.exam_start_datetime).getMonth() + 1) +
            "/" +
            new Date(element.exam_start_datetime).getFullYear() +
            " " +
            new Date(element.exam_start_datetime).getHours() +
            ":" +
            new Date(element.exam_start_datetime).getMinutes() +
            ":" +
            new Date(element.exam_start_datetime).getSeconds();
          str += `<div class="exam_details">

                    <div class="first">
                        <span>Active</span>
                        
                        <p>Scheduled At: ${d}</p>
                    </div>
                    <div class="second">
                        <span>${element.exam_name}</span>
                        <p>${element.duration} mins</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        <p>Total Marks: ${element.total_marks}</p>
                    </div>
                    <button class="startExamBtn" type="button" data-exam-id="${element.exam_id}" onclick="startExamBtnFunction(${element.exam_id})">Start Exam</button>
                    

            </div>`;
        });
      }
      exam.innerHTML = str;

      // await startExamBtnFunction();
    } catch (error) {
      if (error.message == 400) {
        alert("Something Went Wrong");
        location.href = "/login";
      }
      console.error(error.message);
    }
  }
}

async function startExamBtnFunction(id) {
  // let result = await fetch ('/api/start-exam/start-exam-btn-clicked', {
  //   method : 'post',
  //   headers : {
  //     'Content-Type' : 'application/json'
  //   },
  //   body : JSON.stringify({exam_id : id})
  // });

  // let response = await result.json();
  // if (response.success) {
  location.href = `/api/start-exam/instruction/${id}`;
  // }
  // else{
  //   alert(response.message);
  // }
}

async function getUpcoming() {
  if (upcoming.checked) {
    const url = "/api/student/exam/get-upcomingexams";
    try {
      const response = await fetch(url);
      let json = await response.json();
      if (!json.success) {
        throw new Error(json.status);
      }

      json = json.data;
      let str = "";
      if (json.length == 0) {
        str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Upcoming Exam Not Found </div>`;
      } else {
        json = json.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        json.forEach((element) => {
          const d =
            new Date(element.exam_start_datetime).getDate() +
            "/" +
            (new Date(element.exam_start_datetime).getMonth() + 1) +
            "/" +
            new Date(element.exam_start_datetime).getFullYear() +
            " " +
            new Date(element.exam_start_datetime).getHours() +
            ":" +
            new Date(element.exam_start_datetime).getMinutes() +
            ":" +
            new Date(element.exam_start_datetime).getSeconds();
          str += `<div class="exam_details">

                    <div class="first">`;
          if (element.is_setup_done == 0) {
            str += `<div style="width: 300px;display:flex; gap:8px"><span style="background-color: #f7bf0f;">Not Activated</span> <span style='width:180px;opacity: 0.6; background-color:#295F98;"'>Set Up in Progress</span></div>`;
          } else {
            str += `<span style="background-color: #f7bf0f;">Not Activated</span>`;
          }

          str += `<p>Scheduled At: ${d}</p>
                    </div>
                    <div class="second">
                        <span>${element.exam_name}</span>
                        <p>${element.duration} mins</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        <p>${element.total_marks} Marks</p>
                    </div>
                   

            </div>`;
        });
      }
      exam.innerHTML = str;
    } catch (error) {
      if (error.message == 400) {
        alert("Something Went Wrong");
        location.href = "/login";
      }
      console.error(error.message);
    }
  }
}

async function getCompleted() {
  if (completed.checked) {
    const url = "/api/student/exam/get-completedexams";
    try {
      const response = await fetch(url);
      let json = await response.json();
      if (!json.success) {
        throw new Error(response.status);
      }

      json = json.data;
      let str = "";
      if (json.length == 0) {
        str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Completed Exam Not Found </div>`;
      } else {
        json = json.sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        json.forEach((element) => {
          const d =
            new Date(element.exam_start_datetime).getDate() +
            "/" +
            (new Date(element.exam_start_datetime).getMonth() + 1) +
            "/" +
            new Date(element.exam_start_datetime).getFullYear() +
            " " +
            new Date(element.exam_start_datetime).getHours() +
            ":" +
            new Date(element.exam_start_datetime).getMinutes() +
            ":" +
            new Date(element.exam_start_datetime).getSeconds();
          str += `<div class="exam_details">

                    <div class="first">
                        <span style="background-color: #304673;">Completed</span>
                        
                        <p>Scheduled At: ${d}</p>
                    </div>
                    <div class="second">
                        <span>${element.exam_name}</span>
                        <p>${element.duration} mins</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        <p>${element.total_marks} Marks</p>
                    </div>
            </div>`;
        });
      }
      exam.innerHTML = str;
    } catch (error) {
      if (error.message == 400) {
        alert("Something Went Wrong");
        location.href = "/login";
      }
      console.error(error.message);
    }
  }
}

getCurrent();
getUpcoming();
getCompleted();
