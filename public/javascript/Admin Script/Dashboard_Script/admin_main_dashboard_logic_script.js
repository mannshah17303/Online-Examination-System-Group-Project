document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  await TotalStudents();
  await PastExams();
  await QueCategory();
  await TotalBatches();
  await Student_Performance_Analysis();
  await Batch_Analysis();
  await Setup_Deletion_Analysis();
  await Engagement_Analysis();
  setTimeout(()=>{
    removeLoader();
  }, 100);
});

async function TotalStudents() {
  const response = await fetch("/total-students");
  const data = await response.json();
  if (data.success) {
    // console.log(data);
    const totalStudents = document.getElementById("total_stud");
    totalStudents.innerHTML = data.data;
  } else if (data.status == 400) {
    alert("Something went wrong");
    location.href = "/admin/login";
  }
}
async function PastExams() {
  const response = await fetch("/past-exams");
  if (response.ok) {
    const data = await response.json();
    // console.log(data);
    const totalCategory = document.getElementById("total_past_exam");
    totalCategory.innerHTML = data.data;
  }
}
async function QueCategory() {
  const response = await fetch("/que-category");
  if (response.ok) {
    const data = await response.json();
    // console.log(data);
    const totalPastExam = document.getElementById("total_category");
    totalPastExam.innerHTML = data.data;
  }
}
async function TotalBatches() {
  const response = await fetch("/total-batch");
  if (response.ok) {
    const data = await response.json();
    const totalPastExam = document.getElementById("total_batch");
    totalPastExam.innerHTML = data.data;
  }
}

// Charts
async function Student_Performance_Analysis() {
  const response = await fetch("/student-appear-analysis");
  if (response.ok) {
    const data = await response.json();
    // console.log("Student_Performance_Analysis ", data.data);

    // Extracting labels and data for the chart
    const labels = data.data.map(
      (item) => `${item.first_name} ${item.last_name} - ${item.exam_name}`
    );
    const percentages = data.data.map((item) => item.percentage); 
    const obtainedMarks = data.data.map((item) => item.obtained_marks); 
    const totalMarks = data.data.map((item) => item.total_marks); 
    const attemptDates = data.data.map((item) => new Date(item.attempt_date).toLocaleDateString()); 

    // Creating Chart
    const ctx_1 = document.getElementById("myChart-1");

    new Chart(ctx_1, {
      type: "bar",
      data: {
        labels: labels, // Student name + exam name
        datasets: [
          {
            label: "Percentage (%)",
            data: percentages,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100, // Percentage
            title: {
              display: true,
              text: "Percentage (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Student - Exam",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              // Customize tooltip to show additional details
              label: function (context) {
                const index = context.dataIndex;
                return [
                  `Percentage: ${percentages[index].toFixed(2)}%`,
                  `Marks: ${obtainedMarks[index]} / ${totalMarks[index]}`,
                  `Attempt Date: ${attemptDates[index]}`,
                  `Exam: ${data.data[index].exam_name}`,
                ];
              },
            },
          },
          legend: {
            display: true,
          },
        },
      },
    });
  } else {
    console.error("Error Fetching Data");
  }
}
async function Batch_Analysis() {
  try {
    const response = await fetch("/batch-analysis");
    if (response.ok) {
      const data = await response.json();
      // console.log("Batch_Analysis ", data);

      // Sort and limit to top 10 batch-exam pairs
      const maxDisplay = 10;
      const sortedData = data.data
        .sort((a, b) => parseFloat(b.average_marks) - parseFloat(a.average_marks))
        .slice(0, maxDisplay);

      // Extracting labels and data for the chart
      const labels = sortedData.map(
        (item) => `Batch ${item.batch_name} - ${item.exam_name}`
      );
      const averageMarks = sortedData.map((item) => parseFloat(item.average_marks));

      // Creating Chart
      const ctx_2 = document.getElementById("myChart-2");

      new Chart(ctx_2, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Marks",
              data: averageMarks,
              backgroundColor: "rgba(153, 102, 255, 0.27)",
              borderColor: "rgba(81, 16, 211, 0.84)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Average Marks", 
              },
              suggestedMax: Math.max(...averageMarks) * 1.1,
              ticks: {
                stepSize: Math.ceil(Math.max(...averageMarks) / 10),
                callback: function (value) {
                  return value.toFixed(2);
                },
              },
            },
            x: {
              title: {
                display: true,
                text: "Batch - Exam",
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                autoSkip: false, 
                font: {
                  size: 10,
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const item = sortedData[index];
                  return [
                    `Average Marks: ${parseFloat(item.average_marks).toFixed(2)}`,
                    `Batch: ${item.batch_name}`,
                    `Exam: ${item.exam_name}`,
                  ].filter(Boolean);
                },
              },
            },
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    } else {
      console.error("Error Fetching Batch Analysis");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function Setup_Deletion_Analysis() {
  try {
    const response = await fetch("/setup-deletion-analysis");
    if (response.ok) {
      const data = await response.json();
      // console.log("Setup_Deletion_Analysis ", data.data);

      // Group exams by is_setup_done and collect details
      const setupDetails = {
        1: [], // Exams set up
        0: [], // Exams not set up
      };
      data.data.forEach((item) => {
        const key = item.is_setup_done === 1 ? 1 : 0;
        setupDetails[key].push({
          exam_name: item.exam_name,
          total_participants: item.total_participants,
        });
      });

      // Prepare data for the chart
      const chartLabels = ["Exam Set Up", "Exam Not Set Up"];
      const chartData = [
        setupDetails[1].length, // Count of exams set up
        setupDetails[0].length, // Count of exams not set up
      ];

      // Creating Chart
      const ctx = document.getElementById("myChart-3");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: "Number of Exams",
              data: chartData,
              backgroundColor: [
                "rgba(44, 187, 187, 0.46)", // Teal for set up
                "rgba(207, 42, 78, 0.47)", // Red for not set up
              ],
              borderColor: ["rgb(5, 88, 184)", "rgb(243, 0, 0)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Exams", // Clear Y-axis label
              },
              ticks: {
                stepSize: 1, // Whole numbers for counts
                callback: function (value) {
                  return Number.isInteger(value) ? value : null; // Only show integers
                },
              },
            },
            x: {
              title: {
                display: true,
                text: "Setup Status", // Clear X-axis label
              },
              ticks: {
                font: {
                  size: 10, // Readable font size
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const isSetup = index === 0 ? 1 : 0; // 0: Set Up, 1: Not Set Up
                  const exams = setupDetails[isSetup];
                  if (exams.length === 0) {
                    return [`No exams ${isSetup ? "set up" : "not set up"}`];
                  }
                  const tooltipLines = [
                    `Number of Exams: ${exams.length}`,
                    `Exams:`,
                    ...exams.map(
                      (exam) =>
                        `- ${exam.exam_name} (Participants: ${exam.total_participants})`
                    ),
                  ];
                  return tooltipLines;
                },
              },
            },
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    } else {
      console.error("Error Fetching Setup Deletion Analysis");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function Engagement_Analysis() {
  try {
    const response = await fetch("/engagement-analysis");
    if (response.ok) {
      const data = await response.json();
      // console.log("Engagement_Analysis", data);

      // Create a map to aggregate attempts by date
      const attemptsByDate = {};

      data.data.forEach((item) => {
        const date = new Date(item.first_attempt).toLocaleDateString(); // Get the date in local format
        if (!attemptsByDate[date]) {
          attemptsByDate[date] = 0; // Initialize if not present
        }
        attemptsByDate[date] += item.attempts; // Aggregate attempts
      });

      // Prepare labels and data for the chart
      const labels = Object.keys(attemptsByDate); // Dates
      const attempts = Object.values(attemptsByDate); // Total attempts for each date

      // Creating Chart
      const ctx = document.getElementById("myChart-4");

      new Chart(ctx, {
        type: "line", // Change to 'line' if you want a line chart
        data: {
          labels: labels, // Use the aggregated dates as labels
          datasets: [
            {
              label: "Number of Attempts",
              data: attempts, // Use the aggregated attempts as data
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: true, // Set to true if you want to fill the area under the line
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Attempts",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
          },
        },
      });
    } else {
      // console.log("Error Fetching Engagement Analysis");
    }
  } catch (error) {
    // console.log("Error:", error);
  }
}
