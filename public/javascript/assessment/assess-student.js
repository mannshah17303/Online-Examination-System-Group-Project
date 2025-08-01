let studentId = document.getElementById("studentId").innerHTML;
let examId = document.getElementById("examId").innerHTML;
let subjective_marks = 0;
let ObtMark = 0;
let stuMark = [];
document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});
async function examData() {
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
    document.getElementById("duration").innerHTML = res.data.duration + " min";
  } catch (err) {
    // console.log("err in exam data", err);
    if (err == "Error: 402") {
      location.href = "/admin/manageExam";
    } else if (err == "Error: 400") {
      // location.href = "/admin/login";
    }
  }
}
examData();
async function getData() {
  try {
    let assess = document.getElementById("assess").innerHTML;
    // console.log(assess);

    let viewOnly = assess == "view" ? true : false;
    // console.log(viewOnly);

    let res = await fetch(`/api/assessment/student/${assess}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        exam_id: examId,
        student_id: studentId,
      }),
    });
    res = await res.json();
    // console.log(res);
    let studentMArks = [];
    let studentData = res.data[0][0];
    let questions = res.data[1];
    let subjectiveMark = res.data[2];
    // console.log(questions);
    let html = `<p><b>Candidate Name : </b>${studentData.first_name} ${studentData.last_name}</p>`;
    html += `<p><b>Candidate Email : </b>${studentData.email}</p>`;
    document.getElementById("sub-head").innerHTML = html;
    let questionHtml = ``;

    for (let i = 0; i < questions.length; i++) {
      let stuAns = questions[i].student_answer
        ? questions[i].student_answer.answer_txt
        : "";
      //   console.log(stuAns);
      questionHtml += `<div class="mainQ"><div><div class='qdiv'><p>${i + 1}) ${
        questions[i].questionText
      }</p><p>${questions[i].questionMark}</p></div>`;
      if (questions[i].questionType == "Subjective") {
        stuMark.push({
          questionId: questions[i].questionId,
          mark: 0,
          max_mark: questions[i].questionMark,
        });
        
        //if answetext available then comments this
        questionHtml += `<div class="obtMark">`;
        questionHtml += `<div class= 'ans'><p>Student Ans: ${
          questions[i].student_answer
          ? questions[i].student_answer.answer_txt
          : ""
        }</p></div>`;
        questionHtml += `<div class='answerdiv'>`;
        
        //if not then this;
        // questionHtml += `<div class='correct'><p>Correct Ans: ${questions[i].options[0].optionText}</p></div>`;
        if (viewOnly) {
          let mark = subjectiveMark.filter(
            (e) => e.question_id == questions[i].questionId
          );
          // console.log(mark[0].obtained_mark);
          ObtMark += mark[0].obtained_mark;
          //if answer of admin forthis question given remove comment
          // questionHtml += `<p>Obtained mark : ${mark[0].obtained_mark}</p></div>`;
          
          //if not then comments this;
          questionHtml += `<p>Obtained mark : ${mark[0].obtained_mark}</p></div></div>`;
        } else {
          questionHtml += `<input id="${
            questions[i].questionId
          }" class='mark addMark' ${
            viewOnly ? "disabled" : ""
          } onchange='calcMark(this,${questions[i].questionMark},${
            questions[i].questionId
          })'   type="number"  placeholder='Obtained mark' min=0 max="${
            questions[i].questionMark
          }"></div></div>`;
          //if answetext available then comments this
          questionHtml += `</div>`
        }
        
        // ObtMark += document.getElementById("addMark").value;
      } else {
        let flag = 0;
        //for options 
        let alpha = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
        questionHtml += `<div class='options'>`;
        let correctAns = "";
        let mark = 0;
        for (let j = 0; j < questions[i].options.length; j++) {
          if (questions[i].options[j].isCorrect) {
            correctAns = questions[i].options[j].optionText;
          }
          if (
            questions[i].options[j].isCorrect &&
            questions[i].options[j].optionText == stuAns
          ) {
            flag = 1;
            mark = questions[i].questionMark;
            ObtMark += mark;
            questionHtml += `<p class= 'stuAns'>${alpha[j]}) ${questions[i].options[j].optionText} </p>`;
          } else if (questions[i].options[j].optionText == stuAns) {
            questionHtml += `<p class= 'stuAns'>${alpha[j]}) ${questions[i].options[j].optionText} </p>`;
          } else {
            questionHtml += `<p class='option'>${alpha[j]}) ${questions[i].options[j].optionText} </p>`;
          }
        }
        if (flag) {
          questionHtml += `<div class='answerdiv'><div class='correct answerdiv'><p>Correct Ans: ${correctAns}</p></div><p>Obtained mark : ${mark}</p></div></div></div>`;
        } else {
          questionHtml += `<div class='answerdiv'><div class='wrong '><p>Correct Ans: ${correctAns}</p></div><p>Obtained mark : 0</p></div></div></div>`;
        }
      }
      //   console.log(questions[i].student_answer);
    }
    questionHtml += `</div>`;
    questionHtml += `<h3 id='totalMark'>Total Obtained Mark = ${ObtMark}</h3>`;
    questionHtml += viewOnly
      ? ""
      : `<button class='final' onclick='submitMark()'>Submit</button>`;
    document.getElementById("questions").innerHTML = questionHtml;
  } catch (err) {
    console.log("err in get data", err);
  }
}
getData();
function calcMark(e, max) {
  // console.log(max);
  // console.log(qId);

  if (e.value > max) {
    alert(`Mark must be less than ${max}`);
    e.value = 0;
  } else if (e.value < 0) {
    alert(`Mark must be more than 0`);
    e.value = 0;
  } else if (isNaN(e.value)) {
    alert("Mark must be number");
  } else {
    subjective_marks = document.getElementsByClassName("addMark");
    subjective_marks = Array.from(subjective_marks);
    console.log(subjective_marks);
    subjective_marks = subjective_marks.reduce((total, e) => {
      if(e.value){
        console.log(e.value);
        return total + parseFloat(e.value);
      }
      return total
    }, 0);
    // console.log(subjective_marks);
    // console.log("obt_marks",ObtMark);
    
    document.getElementById("totalMark").innerHTML = `Total Obtained Mark = ${
      ObtMark + subjective_marks
    }`;
  }
  // console.log(document.getElementsByClassName("addMark"));
  // console.log(document.getElementsByClassName('addMark')[0].value);
}
async function submitMark() {
  try {
    // subjective_marks = document.getElementsByClassName("addMark");
    // subjective_marks = Array.from(subjective_marks);
    stuMark.forEach((e1) => {
      // console.log(document.getElementById(`${e1.questionId}`).value);
      if (document.getElementById(`${e1.questionId}`).value) {
        e1.mark = document.getElementById(`${e1.questionId}`).value;
      }
    });
    ObtMark += subjective_marks;
    let confirmBox = confirm("Are you sure?");
    if (confirmBox) {
      let res = await fetch(`/api/assessment/submit`, {
        headers: {
          "content-type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          student_id: studentId,
          exam_id: examId,
          obtained_mark: ObtMark,
          subjective_marks: subjective_marks,
          stuMark: stuMark,
        }),
      });
      res = await res.json();
      // console.log("hello");
      // console.log(res);
      if (res.success) {
        alert("Mark Set Successfully");
        document.getElementById("frm_examId").value = examId;
        document.getElementById("assessment_page").submit();
        // location.href = `/admin/assessment/${res.data}`;
      } else if (res.status == 403) {
        alert(res.message);
      } else {
        alert("something went wrong please try again");
      }
    }
  } catch (err) {
    // console.log("err in submit marks", err);
  }
}
