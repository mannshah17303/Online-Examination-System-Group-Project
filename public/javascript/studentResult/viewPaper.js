let exam = document.getElementById("exam");

let completed = document.getElementById("completed");

// console.log("id in javascript is", id);

async function getCompleted() {
  const url = `/api/student/result/view-paper/${id}`;

  try {
    const response = await fetch(url);
    let json = await response.json();
    if (!json.success) {
      throw new Error(json.status);
    }
    json = json.data;
    let str = "";
    

    if (json.length === 0) {
      str += `<div class="exam_details" style="text-align:center; font-weight: bold;">Completed Exam Not Found </div>`;
    } else {
      let sr_no = 1;
      let marksObtained = 0;
      let totalMarks = 0;

      json.forEach((question) => {
        totalMarks += question.questionMark;

        str += `<div class="exam_details">
                    <div class="second">
                    <p>${sr_no}. ${question.questionText}</p>
                        <span>${question.questionMark}</span>
                    </div>
                    <div class="third">
                        <div class="options">`;

        if (question.questionType === "Subjective") {
          marksObtained += parseFloat(question.student_answer.obtained_mark || 0);
          // console.log("marks obtained", marksObtained);

          str += `<div class="student-answer">
                  <strong>Your Answer:</strong> ${question.student_answer.answer_txt}
                </div>`;
        } else {
          // For MCQ questions - find correct option
          const correctOption = question.options.find(
            (option) => option.isCorrect === 1
          );
          // console.log(`Correct option: ${correctOption ? correctOption.optionText : 'None found'}`);
          // console.log(`Student answer: "${question.student_answer.answer_txt}"`);

          // Add marks if answer is correct - with detailed logging
          if (question.student_answer.answer_txt && correctOption) {
            // console.log(`Comparing: "${question.student_answer.answer_txt}" === "${correctOption.optionText}" ? ${question.student_answer.answer_txt === correctOption.optionText}`);
            const studentAnswer = question.student_answer.answer_txt.trim();
            const correctAnswer = correctOption.optionText.trim();
            if (studentAnswer == correctAnswer) {
              
              marksObtained += parseFloat(question.questionMark);
              // console.log(`Answer correct! Adding ${question.questionMark}, marksObtained now: ${marksObtained}`);
            }
          }

          // For MCQ questions
          if (!question.student_answer.answer_txt) {
            // If student's answer is empty, show "Not Attempted"
            str += `<div class="not-attempted" style="color: #FF8A8A; font-weight: bold; margin-bottom: 10px;">Not Attempted</div>`;
          }

          // Display all options regardless of whether attempted or not
          question.options.forEach((option) => {
            const isChecked =
              option.optionText === question.student_answer.answer_txt
                ? "checked"
                : "";

            // Only color the background if the answer was attempted
            let backgroundColor = "transparent";
            if (question.student_answer.answer_txt) {
              backgroundColor = option.isCorrect
                ? "#6E8E59"
                : isChecked
                ? "#FF8A8A"
                : "transparent";
            } else if (option.isCorrect) {
              // Show correct answer even if not attempted
              backgroundColor = "#6E8E59";
            }

            str += `<div class="option">
                      <label style="display: flex; align-items: center;">
                        <input type="radio" name="question_${sr_no}" value="${option.optionText}" ${isChecked} disabled>
                        <span style="
                        background-color: ${backgroundColor}; 
                        padding: 5px; 
                        border-radius: 10px; 
                        margin-left: 5px;">${option.optionText}</span>
                      </label>
                    </div>`;
          });
        }

        str += `</div><p>${question.questionType}</p></div></div>`;
        sr_no++;
      });
      str += `<div class="result-summary" style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 10px; text-align: center;">
      <h3 style="margin-bottom: 10px;">Result Summary</h3>
      <p style="font-size: 18px; font-weight: bold;">Marks Obtained: <span style="color: #6E8E59;">${marksObtained.toFixed(2)}</span> out of <span>${totalMarks}</span></p>
      <p style="font-size: 16px;">Percentage: ${(
        (marksObtained / totalMarks) *
        100
      ).toFixed(2)}%</p>
    </div>`;
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

getCompleted();
