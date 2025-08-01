let exam = document.getElementById("exam");
// let ctx = document.getElementById('myChart');
document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});
async function getCurrent() {
  const url = "/api/student/dashboard";
  try {
    const response = await fetch(url);
    let json = await response.json();
    if (!json.success) {
      if (json.message == 'Already logged in from another device'){
        alert(json.message);
        location.href = '/login';
      }
      else{
        throw new Error(json.status);
      }
    }
    const {
      studentDashboard,
      average_student_marks,
      pass_count,
      fail_count,
      studentDashboardTable,
      showChartQuery,
    } = json.data;

    const labels = showChartQuery.map((item) => item.exam_name);

    const dataValues = showChartQuery.map(
      (item) => (item.obtained_marks / item.total_marks) * 100
    );
    const pending_results =
      parseInt(studentDashboard[0].total_exams) -
      parseInt(pass_count.length) -
      parseInt(fail_count.length);

    let str = "";
    str += `<div class="cards-container">`;
    studentDashboard.forEach((element) => {
      str += ` <div class="card">
  
  <h2>Total Exams</h2>
  <p class="price">${element.total_exams}</p>
  
  
</div> `;
    });

    // console.log(average_student_marks + ' in login')

    if (average_student_marks.length == 0) {
      str += ` <div class="card">
  
  <h2>Average Marks</h2>
  <p class="price">0</p>
  
  
</div> `;
    } else {
      average_student_marks.forEach((element) => {
        str += ` <div class="card">
    
    <h2>Average Marks</h2>
    <p class="price">${element.average_student_marks}</p>
    
    
  </div> `;
      });
    }

    str += ` <div class="card max-w-sm mx-auto text-center bg-white text-blue-900 rounded-lg shadow-lg transition-transform duration-300 ease-in-out opacity-0 animate-fadeIn p-6">
  
  <h2 class="text-2xl font-bold mb-4">Passed Exam</h2>
  <p class="price text-3xl font-semibold text-blue-600">${pass_count.length}</p>
  
  
</div> `;

    str += ` <div class="card">
  
  <h2>Failed Exam</h2>
  <p class="price">${fail_count.length}</p>
  
  
</div> `;

    str += ` <div class="card">
  
<h2>Pending Results</h2>
<p class="price">${pending_results}</p>


</div> `;

    str += `</div>`;
    str += ` <div>
                    <canvas id="myChart"></canvas>
                </div>`;
    str += ` <div>
                    <canvas id="myChart1"></canvas>
                </div>`;
    str += `<table class="tableStudent" border="0" class="exam-table">
                    <tr>
                        <td>Exam Name</td>
                        <td>Score</td>
                        <td>Date</td>
                        <td>Grade</td>
                        <td>Pass/Fail</td>
                    </tr>`;
    if (studentDashboardTable.length > 0) {
      studentDashboardTable.forEach((element) => {
        let date =
          new Date(element.result_date).getDate() +
          "-" +
          (new Date(element.result_date).getMonth() + 1) +
          "-" +
          new Date(element.result_date).getFullYear();
        str += ` <tr>
                                          <td>${element.exam_name}</td>
                                          <td>${element.score}</td>
                                          <td>${date}</td>`;

        let result = (element.score / element.total_marks) * 100;
        if (element.passing_marks > element.score) {
          str += `<td>F</td>`;
        } else {
          if (result >= 80) {
            str += `<td>A</td>`;
          } else if (result >= 60) {
            str += `<td>B</td>`;
          } else if (result >= 50) {
            str += `<td>C</td>`;
          } else if (result >= 40) {
            str += `<td>D</td>`;
          } else {
            str += `<td>F</td>`;
          }
        }

        if (element.passing_marks <= element.score) {
          str += `<td class='parent'><span class='pass'>Pass</span></td>`;
        } else {
          str += `<td class='parent'><span class='fail'>Fail</span></td>`;
        }
        str += `</tr>`;
      });
    } else {
      str += `<tr class="nodata"><th> Exam not given </th></tr>`;
    }

    str += `</table>`;

    exam.innerHTML = str;
    new Chart(document.getElementById("myChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Obtained marks percentage",
            data: dataValues,
            backgroundColor: dataValues.map(
              (value) =>
                value >= 80
                  ? "rgba(46, 204, 113, 0.7)" // A grade - green
                  : value >= 60
                  ? "rgba(52, 152, 219, 0.7)" // B grade - blue
                  : value >= 50
                  ? "rgba(241, 196, 15, 0.7)" // C grade - yellow
                  : value >= 40
                  ? "rgba(230, 126, 34, 0.7)" // D grade - orange
                  : "rgba(231, 76, 60, 0.7)" // F grade - red
            ),
            borderColor: dataValues.map((value) =>
              value >= 80
                ? "rgba(46, 204, 113, 1)"
                : value >= 60
                ? "rgba(52, 152, 219, 1)"
                : value >= 50
                ? "rgba(241, 196, 15, 1)"
                : value >= 40
                ? "rgba(230, 126, 34, 1)"
                : "rgba(231, 76, 60, 1)"
            ),
            borderWidth: 1,
            borderRadius: 5,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let value = context.raw;
                let grade =
                  value >= 80
                    ? "A"
                    : value >= 60
                    ? "B"
                    : value >= 50
                    ? "C"
                    : value >= 40
                    ? "D"
                    : "F";
                return `${context.dataset.label}: ${value.toFixed(
                  1
                )}% (Grade: ${grade})`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    });
    new Chart(document.getElementById("myChart1"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Obtained marks percentage",
            data: dataValues,
            fill: true,
            backgroundColor: dataValues.map(
              (value) =>
                value >= 80
                  ? "rgba(46, 204, 113, 0.7)" // A grade - green
                  : value >= 60
                  ? "rgba(52, 152, 219, 0.7)" // B grade - blue
                  : value >= 50
                  ? "rgba(241, 196, 15, 0.7)" // C grade - yellow
                  : value >= 40
                  ? "rgba(230, 126, 34, 0.7)" // D grade - orange
                  : "rgba(231, 76, 60, 0.7)" // F grade - red
            ),
            borderColor: dataValues.map((value) =>
              value >= 80
                ? "rgba(46, 204, 113, 1)"
                : value >= 60
                ? "rgba(52, 152, 219, 1)"
                : value >= 50
                ? "rgba(241, 196, 15, 1)"
                : value >= 40
                ? "rgba(230, 126, 34, 1)"
                : "rgba(231, 76, 60, 1)"
            ),
            borderWidth: 1,
            borderRadius: 5,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let value = context.raw;
                let grade =
                  value >= 80
                    ? "A"
                    : value >= 60
                    ? "B"
                    : value >= 50
                    ? "C"
                    : value >= 40
                    ? "D"
                    : "F";
                return `${context.dataset.label}: ${value.toFixed(
                  1
                )}% (Grade: ${grade})`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    });
  } catch (error) {
    if(error.message == 400){
      // console.error(error);
      alert("Something Went Wrong");
      // location.href = '/login'
    }
  }
}

getCurrent();
