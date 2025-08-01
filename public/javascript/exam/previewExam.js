const url = window.location.search;
const urlParams = new URLSearchParams(url);
const examId = urlParams.get('examId')
getPreview(examId)
async function getPreview(id) {
    const url = `/get-preview-exam-data/?examid=${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        // console.log(json);
        // console.log(json.ExamBasicData);
        let exambasic = json.data.ExamBasicData[0]
        let category_data = json.data.QuecategoriesOfcreatedExams
        let exam_details = json.data.questions
        document.getElementById("heading").innerHTML = `
            <div id='heading_left'>
                <div>Exam Name : <span>${exambasic.exam_name}</span></div>
                <div>Exam Duration : <span>${exambasic.exam_description}</span></div>
            </div>
            <div id='heading_right'>
                <div>Total Candidate : <span>${exambasic.total_candidates}</span></div>
                <div>Total Marks : <span>${exambasic.total_marks}</span></div>
                <div>Duration : <span>${exambasic.duration} Mins</span></div>
            </div>`

        let str = ''
        category_data.forEach(element => {
            str += `<div>${element.category_name}</div>`
        });

        let ques = ''
        exam_details.forEach((element, key) => {
            ques += `<div class="exam_container">
                <div class='ques'>
                    <div>${key + 1}) ${element.questionText}</div>
                    <div>Marks : ${element.marks}</div>
                </div>`
            if (element.questionType == 'Subjective') {
                //ques += `<div class='ans'>Ans : ${element.options[0].optionText}</div>`
            }
            else {
                element.options.forEach((ele) => {
                    if (ele.isCorrect == 1) {
                        ques += `<div class='option'><input type='radio' checked onclick="this.checked = true;"><label style='background-color: #dcffee;'>${ele.optionText}</label></div>`
                    } else {
                        ques += `<div class='option'><input type='radio' onclick="this.checked = false;" ><label>${ele.optionText}</label></div>`
                    }

                })
            }
            ques += `</div>`
        })


        document.getElementById('categroy').innerHTML = str
        document.getElementById('exam').innerHTML = ques
    } catch (error) {
        // console.log(error);
        alert('something went wrong')
    }
}

