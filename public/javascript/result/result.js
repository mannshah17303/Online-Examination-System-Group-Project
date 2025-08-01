document.getElementById("frm_examId").readOnly = true;
let page_count_ele = document.getElementById("page_count");
let current_page = document.getElementById("current_page");
let main_con = document.getElementById("main_con");
let search_box = document.getElementById("search_box");
window.onload = async () => {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
  try {
    let data = await examdata(1);
    let page_count = Math.ceil(data.data.length / 5);
    page_count_ele.innerHTML = page_count;
    // console.log(data.data);
    change_main_con(data.data.examData);
  } catch (err) {
    // console.log("err", err);
  }
};
function examdata(page, like) {
  return new Promise(async (res, rej) => {
    try {
      let response = await fetch("/api/result/get-exam-result", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          //"created_by":1, from session storage
          // created_by get from middleware
          page: page,
          like: like,
        }),
      });
      let data = await response.json();
      // console.log(data);
      if (!data.success) {
        if (data.status == 400) {
          alert("Authentication failed");
          location.href = "/admin/login";
        }
      }

      res(data);
    } catch (err) {
      rej(err);
    }
  });
}
async function change_con(e) {
  // console.log(e.innerHTML);
  if (e.innerHTML == "&lt;&lt;") {
    //<<
    current_page.innerHTML = 1;
  } else if (e.innerHTML == "prev") {
    if (current_page.innerHTML != 1) {
      current_page.innerHTML--;
    }
  } else if (e.innerHTML == "next") {
    if (current_page.innerHTML != page_count_ele.innerHTML)
      current_page.innerHTML++;
  } else if (e.innerHTML == "&gt;&gt;") {
    //>>
    current_page.innerHTML = page_count_ele.innerHTML;
  } else {
    current_page.innerHTML = 1;
  }
  try {
    let data = await examdata(current_page.innerHTML, search_box.value);
    let page_count = Math.ceil(data.data.length / 5);
    page_count_ele.innerHTML = page_count;
    // console.log(data.data);
    change_main_con(data.data.examData);
  } catch (err) {
    // console.log("err", err);
  }
}
function change_main_con(examData) {
  main_con.innerHTML = `<tr>
            <th>index</th>
            <th>Exam Name</th>
            <th>appered candidate ratio</th>
            <th>result</th>
            <th>student result</th>
          </tr>`;
  let count = (current_page.innerHTML - 1) * 5;
  if (examData.length == 0) {
    main_con.innerHTML = `No Result found`;
    main_con.style.padding = "10px";
    document.getElementById("page").style.display = "none";
  } else {
    main_con.style.padding = "0px";
    document.getElementById("page").style.display = "flex";
    examData.forEach((e) => {
      let percentage = (e.pass_candidate / e.present_candidate) * 100;
      percentage = percentage.toFixed(2);
      if (e.present_candidate == 0) {
        percentage = "No candidate appear";
      } else {
        percentage += "%";
      }
      // console.log(percentage);

      count++;
      let new_div = document.createElement("tr");
      new_div.className = "con";
      let btn_td = document.createElement("td");
      let new_btn = document.createElement("button");
      new_btn.className = "btn";
      new_btn.innerHTML = "View Result";
      // console.log(new_btn);
      new_btn.addEventListener("click", () => {
        document.getElementById("frm_examId").value = e.exam_id;
        document.getElementById("go_to_student_result").submit();
      });
      btn_td.appendChild(new_btn);
      // <button class="btn">View Result</button>
      new_div.innerHTML = `<td>${count}</td><td>${e.exam_name}</td><td>${e.present_candidate}/${e.invited_candidate}</td><td>${percentage}</td>`;
      new_div.appendChild(btn_td);
      main_con.appendChild(new_div);
    });
  }
}

// function goToStudentData(id) {
//   // console.log("hello from got  to student");
//   // document.getElementById("go_to_student_result");
//   document.getElementById("frm_examId").value = id;
//   document.getElementById("go_to_student_result").submit();
// }

// function closeDig() {
//   document.getElementById("search").value = ``;
//   document.getElementById("dialogResult").close();
// }
