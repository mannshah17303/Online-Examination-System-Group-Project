let total_no = document.getElementById("total_no");
let search_val = document.getElementById("search");
let tbl = document.getElementById("con");
let pageing = document.getElementById("pageing");
search_val.value = ``;
let currPage = 1;
let temp_serarch_state = "total";
let examId = document.getElementById("examId").innerHTML;
// console.log("exam id:", examId);
let pending = document.getElementById("pending");
document.getElementById("frm_examId").readOnly = true;
document.getElementById("frm_studentId").readOnly = true;
window.onload = async () => {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);

  try {
    let res = await fetch(`/api/assessment/exam-data`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        examId: examId,
      }),
    });
    res = await res.json();
    if(res.status==402){
      alert(res.message)
    }
    // console.log(res);

    if (!res.success) {
      throw new Error(res.status);
    }
    // console.log(res.data);
    document.getElementById("exam_name").innerHTML = res.data.exam_name;
    document.getElementById("total_mark").innerHTML =
      "Total Marks : " + res.data.total_marks;
    document.getElementById("passing_marks").innerHTML =
      "Passing Marks : " + res.data.passing_marks;
    document.getElementById("duration").innerHTML = "Duration: " + res.data.duration + " min";
    // let btn = document.getElementById("pending");
    // console.log(btn);

    // btn.style.backgroundColor = "#304673";
    // btn.style.color = "#fff";
    pending.checked = true;
    getPending(1);
  } catch (err) {
    // console.log(err);
    if (err == "Error: 402") {
      location.href = "/admin/manageExam";
    } else if (err == "Error: 400") {
      location.href = "/admin/login";
    }
    // console.log("err",err);
  }
};
function getData(e) {
  // console.log("in get data");

  // console.log(e);
  let id1 = e.id;
  search_val.value = ``;
  getState(id1, 1, search_val.value);
}

async function getTotalInvited(page, liked) {
  try {
    let res = await fetch(`/api/assessment/totalInvited`, {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ examId: examId, page: page, liked: liked }),
    });

    res = await res.json();
    if (!res.success) {
      throw new Error(res.status);
    }
    // console.log(res);
    // console.log(res.data[0][0].total);
    let data = res.data.student_data;
    // let pageCount = Math.ceil(res.data.total_no / 5);
    // console.log(pageCount);
    currPage = page;
    let temp = currPage * 5 - 5 + 1;
    total_no.innerHTML = `Total Invited: ${res.data.total_no}`;
    temp_serarch_state = "total";
    // console.log(currPage);
    createHtml("total", data, currPage, res.data.total_page);
    // document.getElementById("tab-head").innerHTML = html;
    // console.log("called");
  } catch (err) {
    // console.log("err", err);
    if (err == "Error: 402") {
      location.href = "/admin/manageExam";
    } else if (err == "Error: 400") {
      location.href = "/admin/login";
    }
    // location.href = "admin/login";
  }
}
async function getAttended(page, liked) {
  try {
    let res = await fetch(`/api/assessment/attended`, {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ examId: examId, page: page, liked: liked }),
    });
    res = await res.json();
    if (!res.success) {
      throw new Error(res.status);
    }
    // console.log(res);
    let data = res.data.student_data;
    // let pageCount = Math.ceil(res.data.total_no / 5);
    // console.log(pageCount);
    currPage = page;
    createHtml("attended", data, currPage, res.data.total_page);
    total_no.innerHTML = `Total Attended: ${res.data.total_no}`;
    temp_serarch_state = "attended";
    // document.getElementById("tab-head").innerHTML = html;
  } catch (err) {
    // console.log("err", err);
    if (err == "Error: 402") {
      location.href = "/admin/manageExam";
    } else if (err == "Error: 400") {
      location.href = "/admin/login";
    }
    // location.href = "admin/login";
  }
}

async function getAssessed(page, liked) {
  try {
    let res = await fetch(`/api/assessment/assessed`, {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ examId: examId, page: page, liked: liked }),
    });
    res = await res.json();
    if (!res.success) {
      throw new Error(res.status);
    }
    // console.log(res);
    let data = res.data.student_data;
    // let pageCount = Math.ceil(res.data.total_no / 5);
    // console.log(pageCount);
    currPage = page;
    // console.log("curr", currPage);
    createHtml("assessed", data, currPage, res.data.total_page);
    total_no.innerHTML = `Total Assessed: ${res.data.total_no}`;
    temp_serarch_state = "assessed";
    // document.getElementById("tab-head").innerHTML = html;
  } catch (err) {
    // console.log("err", err);
    if (err == "Error: 402") {
      location.href = "/admin/manageExam";
    } else if (err == "Error: 400") {
      location.href = "/admin/login";
    }
    // location.href = "admin/login";
  }
}
async function getPending(page, liked) {
  try {
    let res = await fetch(`/api/assessment/pending`, {
      headers: {
        "content-type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ examId: examId, page: page, liked: liked }),
    });

    res = await res.json();
    // console.log(res);
    if (!res.success) {
      throw new Error(res.status);
    }
    let data = res.data.student_data;
    // let pageCount = Math.ceil(res.data.total_no / 5);
    // console.log(pageCount);
    currPage = page;
    createHtml("pending", data, currPage, res.data.total_page);
    total_no.innerHTML = `Total Pending: ${res.data.total_no}`;
    temp_serarch_state = "pending";
    // document.getElementById("tab-head").innerHTML = html;
  } catch (err) {
    // console.log("err", err);
    if (err == "Error: 402") {
      location.href = "/admin/manageExam";
    } else if (err == "Error: 400") {
      location.href = "/admin/login";
    }
    // location.href = "admin/login";
  }
}
function last(page, fetchApi) {
  // console.log("last ccalled", page, fetchApi);
  let state = fetchApi.id;
  getState(state, page, search_val.value);
}

function first(page, fetchApi) {
  // console.log("last ccalled", page, fetchApi);
  let state = fetchApi.id;
  getState(state, page, search_val.value);
}
function prev(page, fetchApi) {
  currPage--;
  // console.log("last ccalled", page, fetchApi);
  let state = fetchApi.id;
  getState(state, currPage, search_val.value);
}
function next(page, fetchApi) {
  currPage++;
  // console.log("last ccalled", page, fetchApi);
  let state = fetchApi.id;
  getState(state, currPage, search_val.value);
}
function search(e) {
  // console.log("in search");

  // console.log(fetchApi.id);
  // console.log(e.value);
  // let state = fetchApi.id;
  getState(temp_serarch_state, 1, e.value);
}
function getState(state, page, value) {
  switch (state) {
    case "total":
      getTotalInvited(page, value);
      break;
    case "attended":
      getAttended(page, value);
      break;
    case "assessed":
      getAssessed(page, value);
      break;
    case "pending":
      getPending(page, value);
      break;

    default:
      break;
  }
}
function createHtml(state, data, page, pageCount) {
  pageing.style.display = "flex";
  document.getElementById("con").innerHTML = ``;
  let start = currPage * 5 - 5 + 1;
  // console.log(state);
  let table_head = document.createElement("tr");
  if (pageCount == 0) {
    pageing.style.display = "none";
    document.getElementById(
      "con"
    ).innerHTML = `<tr><th></th><th>No student found</th><th></th></tr>`;
  } else {
    if (state == "assessed") {
      table_head.innerHTML = `<th>index</th><th>Name</th><th>email</th><th>marks</th><th>action</th>`;
    } else if (state == "pending") {
      table_head.innerHTML = `<th>index</th><th>Name</th><th>email</th><th>action</th>`;
    } else {
      table_head.innerHTML = `<th>index</th><th>Name</th><th>email</th>`;
    }
    tbl.appendChild(table_head);
    for (let i = 0; i < data.length; i++) {
      let table_data = document.createElement("tr");
      table_data.innerHTML = `
<td>${start}</td>
<td>${data[i].full_name}</td>
<td>${data[i].email}</td>`;
      if (state == "assessed") {
        table_data.innerHTML += `<td>${data[i].obtained_marks}</td>`;
        let temp_td = document.createElement("td");
        let temp_btn = document.createElement("button");
        temp_btn.className = "assess";
        temp_btn.innerHTML = "View Result";
        temp_btn.addEventListener("click", () => {
          goToAssess("view", data[i].student_id);
        });
        temp_td.appendChild(temp_btn);
        table_data.appendChild(temp_td);
        // <td><button onclick="goToAssess('view',${data[i].student_id})" class='assess'>View Result</button></td>;
      } else if (state == "pending") {
        let temp_td = document.createElement("td");
        let temp_btn = document.createElement("button");
        temp_btn.className = "assess";
        temp_btn.innerHTML = "Assess";
        temp_btn.addEventListener("click", () => {
          goToAssess("assess", data[i].student_id);
        });
        temp_td.appendChild(temp_btn);
        table_data.appendChild(temp_td);
        // table_data.innerHTML += `<td><button onclick="goToAssess('assess',${data[i].student_id})" class='assess'>Assess</button></td>`;
      } else {
        // html += `</tr>`;
      }
      start++;
      tbl.appendChild(table_data);
      console.log(table_data);
    }
    pageing.innerHTML = `
          <span id="page">
            <button onclick='first(${1},${state})' class="page-btn"><<</button>
            <button ${
              page == 1 ? "disabled" : ""
            } onclick='prev(${currPage},${state})' class="page-btn">prev</button>
             ${page} of ${pageCount} 
             <button ${
               page == pageCount ? "disabled" : ""
             } onclick='next(${currPage},${state})' class="page-btn">next</button> 
             <button onclick='last(${pageCount},${state})' class="page-btn">>></button>
          </span>`;
    // document.getElementById("tab-data").appendChild(pageing)
  }
  // console.log(tbl.innerHTML);
}
function goToAssess(view, studentId) {
  // console.log(view);
  document
    .getElementById("assess_paper")
    .setAttribute("action", `/assessment/student/${view}`);
  document.getElementById("frm_examId").value = examId;
  document.getElementById("frm_studentId").value = studentId;
  document.getElementById("assess_paper").submit();
}
