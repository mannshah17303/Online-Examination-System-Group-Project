let exam = document.getElementById("exam");
let completed = document.getElementById("completed");
document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});
async function getCompleted() {
  const url = "/api/student/result/get-completedexams";
  try {
    const response = await fetch(url);
    let json = await response.json();
    if (!json.success) {
      throw new Error(json.status);
    }

    json = json.data;
    console.log("json: ", json);
    
    let str = "";
    if (json.length == 0) {
      str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Completed Exam Not Found </div>`;
    } else {
      json.forEach((element) => {
        const d =
          new Date(element.created_at).getDate() +
          "/" +
          (new Date(element.created_at).getMonth() + 1) +
          "/" +
          new Date(element.created_at).getFullYear();

        const status = element.result_date ? "Completed" : "Pending";
        const statusColor = element.result_date ? "#304673" : "#FFA500";
        // console.log(element.exam_id);

        const resultDate = element.result_date
          ? new Date(element.result_date).getDate() +
            "/" +
            (new Date(element.result_date).getMonth() + 1) +
            "/" +
            new Date(element.result_date).getFullYear()
          : "Awaiting Results";

        str += `<div class="exam_details">

                    <div class="first">
                        <span style="background-color:${statusColor};">${status}</span>
                        
                        <p>Exam Date : ${d}</p>
                        <p>Result Date : ${resultDate}</p>

                    </div>
                    <div class="second">
                        <span>${element.exam_name}</span>
                        <p>${element.duration} mins</p>
                    </div>
                    <div class="third">
                        <span>${element.exam_description}</span>
                        <div class="show">${
                          element.result_date
                            ? `<p> Total: ${element.total_marks} Marks</p>
                        <p> Obtained: ${element.obtained_marks} Marks</p>
                        <a onclick="goToPaper(${element.exam_id})"  class="view-btn">View Paper</a>`
                            : `<p>Results will be available soon</p>`
                        }
                        </div>
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

function goToPaper(exam_id) {
  // console.log(exam_id);

  document.getElementById("exam_id").value = exam_id;
  document.getElementById("goForm").submit();
}

getCompleted();
