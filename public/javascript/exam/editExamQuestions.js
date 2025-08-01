
var selectedQuestions = new Map();   // handle selected questions
var removedQuestions = new Set();   //handle removed question

// const url = window.location.search;
// const urlParams = new URLSearchParams(url);
// const examId = urlParams.get('examId');
//const examId=parseInt(document.getElementById('examId').innerHTML)
// document.getElementById('go_to_edit_exam').style.display = 'none'
// document.getElementById('marks').readOnly = true;
// document.getElementById('exam_Id').readOnly = true;
//console.log("exam Id" + examId);

var totalMarks = 0; // track total marks
var leaveFlag = 0

//onload all category will load ,exam name and total marks will set and all question will list 
window.addEventListener('load', async () => {

    loadCategoryData();

    var questionData = await fetch(`/exam-edit-data?categoryId=all&questionType=all&examId=${examId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'requestTime': new Date().getTime()
        }
    });
    questionData = await questionData.json();
    if (questionData.status == 200) {
        for (let obj of questionData.data.selectedQuestions) {     //make entry in selected question already selected from db
            let tempObj = {
                questionId: obj.question_id,
                marks: obj.marks
            }
            selectedQuestions.set(obj.question_id, tempObj);
        }

        totalMarks = questionData.data.examBasicData[0].total_marks
        if (totalMarks) {
            document.getElementById('total-marks').innerText = totalMarks
        }
        else {
            document.getElementById('total-marks').innerText = 0
        }

        document.getElementById('exam-name').innerText = questionData.data.examBasicData[0].exam_name

        // console.log(selectedQuestions);

        listQuestions(questionData);

    } else {
        alert(questionData.message);
        location.href = `/admin/manageExam`
        return
    }
    //console.log(questionData);
    //add all selected question to selectedQuestion map

})

//load data in category dropdown
async function loadCategoryData() {
    const categoryResponse = await fetch('/get-categories', {
        method: 'GET'
    })
    const categoryResponseInJson = await categoryResponse.json()
    //console.log(categoryResponseInJson);

    //import parent div
    let categotyDiv = document.getElementsByClassName('category-select')[0];

    let categorySelect = document.getElementById('category');

    const categories = categoryResponseInJson.data
    //console.log(categories);
    let option = document.createElement('option');
    option.value = 'all';
    option.textContent = 'All';
    categorySelect.appendChild(option);

    //add dynamicaly options
    for (let category of categories) {
        let option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.category_name;
        categorySelect.appendChild(option);
    }

}

//list questrion according to category
document.getElementById('category').addEventListener('change', async () => {
    let categoryId = document.getElementById('category').value;
    let questionType = document.getElementById('question-type').value
    var questionData = await fetch(`/exam-edit-data?categoryId=${categoryId}&questionType=${questionType}&examId=${examId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'requestTime': new Date().getTime()
        }
    });
    questionData = await questionData.json();
    if (questionData.status == 200) {
        listQuestions(questionData)
    } else {
        alert(questionData.message);
        location.href = `/admin/manageExam`
        return
    }
})

//list question according to type
document.getElementById('question-type').addEventListener('change', async () => {
    let categoryId = document.getElementById('category').value;
    let questionType = document.getElementById('question-type').value
    var questionData = await fetch(`/exam-edit-data?categoryId=${categoryId}&questionType=${questionType}&examId=${examId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'requestTime': new Date().getTime()
        }
    });
    questionData = await questionData.json();
    if (questionData.status == 200) {
        listQuestions(questionData)
    } else {
        alert(questionData.message);
        location.href = `/admin/manageExam`
        return
    }

})


//list question
function listQuestions(questionData) {


    let questionList = document.getElementById('not-selected-question');
    let selectedQuestionDiv = document.getElementById('selected-questions');
    questionList.innerHTML = '';
    selectedQuestionDiv.innerHTML = '';
    //let selectedQuestionMap = new Map();

    const basicDetail = questionData.data.examBasicData;
    const previousSelectedQuestions = questionData.data.selectedQuestions;
    const questions = questionData.data.questions;
    // console.log(basicDetail);
    // console.log(previousSelectedQuestions);
    // console.log(questions);

    // make track of question index
    let questionIndex = 1;
    if (selectedQuestions.size > 0) {
        let title = document.createElement('h3');
        title.textContent = 'Selected Questions:'
        selectedQuestionDiv.appendChild(title)
        let title2 = document.createElement('h3');
        title2.textContent = 'Question List:';
        questionList.appendChild(title2)

    } else {
        //selectedQuestionDiv.remove();
    }
    for (let data of questions) {

        //list mcq type question
        if (data.questionType == 'MCQ') {
            let question = document.createElement('div');

            question.setAttribute('class', 'question');


            //question and options

            let questionContent = document.createElement('div');
            question.appendChild(questionContent);
            questionContent.setAttribute('class', 'question-content');

            let questionText = document.createElement('div');
            questionContent.appendChild(questionText);



            let optionContainer = document.createElement('div');
            questionContent.appendChild(optionContainer);
            optionContainer.setAttribute('class', 'option-container');

            let optionIndex = 65;
            //console.log(data.options);
            for (let option of data.options) {
                let optionText = document.createElement('div');
                optionContainer.appendChild(optionText);
                let index = String.fromCharCode(optionIndex);
                optionText.innerText = `${index}) ${option.optionText}`
                if (option.isCorrect == '1') {
                    optionText.style.color = 'green';
                }
                optionIndex++;
            }

            //add button and marks

            let questionAction = document.createElement('div');
            question.appendChild(questionAction);
            questionAction.setAttribute('class', 'question-action');

            let questionAddBtnDiv = document.createElement('div');
            questionAction.appendChild(questionAddBtnDiv);
            questionAction.setAttribute('class', 'question-add-btn');

            //check if question is already selected
            if (selectedQuestions.has(data.questionId)) {
                questionText.innerText = `${data.questionText}`;
                const tempQuestionObj = selectedQuestions.get(data.questionId);
                let addBtn = document.createElement('input');
                addBtn.type = 'button';
                addBtn.value = '-';
                addBtn.id = `add-btn-${data.questionId}`
                addBtn.onclick = () => removeQuestionInExam(data.questionId, addBtn);
                questionAddBtnDiv.appendChild(addBtn);

                let questionMarks = document.createElement('div');
                questionAction.appendChild(questionMarks);
                questionMarks.setAttribute('class', 'question-marks');

                let marksLabel = document.createElement('label');
                marksLabel.setAttribute('for', 'mark');
                marksLabel.innerText = 'Mark : ';
                questionMarks.appendChild(marksLabel);

                let marksInput = document.createElement('input');
                marksInput.type = 'text';
                marksInput.id = `mark-${data.questionId}`;
                marksInput.name = 'marks';
                marksInput.readOnly = true
                marksInput.value = tempQuestionObj.marks
                marksLabel.appendChild(marksInput);
                selectedQuestionDiv.appendChild(question)
            } else {
                questionText.innerText = `${questionIndex}) ${data.questionText}`;
                questionIndex++

                let addBtn = document.createElement('input');
                addBtn.type = 'button';
                addBtn.value = '+';
                addBtn.id = `add-btn-${data.questionId}`
                addBtn.onclick = () => addQuestionInExam(data.questionId);
                questionAddBtnDiv.appendChild(addBtn);

                let questionMarks = document.createElement('div');
                questionAction.appendChild(questionMarks);
                questionMarks.setAttribute('class', 'question-marks');

                let marksLabel = document.createElement('label');
                marksLabel.setAttribute('for', 'mark');
                marksLabel.innerText = 'Mark : ';
                questionMarks.appendChild(marksLabel);

                let marksInput = document.createElement('input');
                marksInput.type = 'text';
                marksInput.id = `mark-${data.questionId}`;
                marksInput.name = 'marks';
                marksInput.addEventListener('keypress', (event) => {
                    if (event.key === "Enter") {
                        addQuestionInExam(data.questionId)
                    }

                })
                marksLabel.appendChild(marksInput);

                questionList.appendChild(question)
            }





        } else {
            let question = document.createElement('div');
            questionList.appendChild(question);
            question.setAttribute('class', 'question');


            //question and options

            let questionContent = document.createElement('div');
            question.appendChild(questionContent);
            questionContent.setAttribute('class', 'question-content');

            let questionText = document.createElement('div');
            questionContent.appendChild(questionText);


            //const ans = data.options[0].optionText;

            //let optionContainer = document.createElement('div');
            //questionContent.appendChild(optionContainer);
            // optionContainer.setAttribute('class', 'answer-container');

            // optionContainer.innerHTML = `Answer :<span style="color:green"> ${ans}<span>`

            let questionAction = document.createElement('div');
            question.appendChild(questionAction);
            questionAction.setAttribute('class', 'question-action');

            let questionAddBtnDiv = document.createElement('div');
            questionAction.appendChild(questionAddBtnDiv);
            questionAction.setAttribute('class', 'question-add-btn');

            if (selectedQuestions.has(data.questionId)) {

                questionText.innerText = `${data.questionText}`;


                const tempQuestionObj = selectedQuestions.get(data.questionId);
                let addBtn = document.createElement('input');
                addBtn.type = 'button';
                addBtn.value = '-';
                addBtn.id = `add-btn-${data.questionId}`
                addBtn.onclick = () => removeQuestionInExam(data.questionId, addBtn);
                questionAddBtnDiv.appendChild(addBtn);

                let questionMarks = document.createElement('div');
                questionAction.appendChild(questionMarks);
                questionMarks.setAttribute('class', 'question-marks');

                let marksLabel = document.createElement('label');
                marksLabel.setAttribute('for', 'mark');
                marksLabel.innerText = 'Mark : ';
                questionMarks.appendChild(marksLabel);

                let marksInput = document.createElement('input');
                marksInput.type = 'text';
                marksInput.id = `mark-${data.questionId}`;
                marksInput.name = 'marks';
                marksInput.value = tempQuestionObj.marks
                marksInput.readOnly = true
                marksLabel.appendChild(marksInput);

                selectedQuestionDiv.appendChild(question)
            } else {
                questionText.innerText = `${questionIndex}) ${data.questionText}`;
                questionIndex++;

                let addBtn = document.createElement('input');
                addBtn.type = 'button';
                addBtn.value = '+';
                addBtn.id = `add-btn-${data.questionId}`
                addBtn.onclick = () => addQuestionInExam(data.questionId);
                questionAddBtnDiv.appendChild(addBtn);

                let questionMarks = document.createElement('div');
                questionAction.appendChild(questionMarks);
                questionMarks.setAttribute('class', 'question-marks');

                let marksLabel = document.createElement('label');
                marksLabel.setAttribute('for', 'mark');
                marksLabel.innerText = 'Mark : ';
                questionMarks.appendChild(marksLabel);

                let marksInput = document.createElement('input');
                marksInput.type = 'text';
                marksInput.id = `mark-${data.questionId}`;
                marksInput.name = 'marks';
                marksInput.addEventListener('keypress', (event) => {
                    if (event.key === "Enter") {
                        addQuestionInExam(data.questionId)
                    }

                })
                marksLabel.appendChild(marksInput);

                questionList.appendChild(question);
            }

        }
    }



}
async function addQuestionInExam(questionId) {
    //console.log(questionId);
    const questionMarks = document.getElementById(`mark-${questionId}`);
    if (questionMarks.value == '') {
        alert("please enter marks first");
        return
    } else if (selectedQuestions.has(questionId)) {
        alert('This question already selected');
        return
    } else {

        if (removedQuestions.has(questionId)) {
            removedQuestions.delete(questionId)
            // console.log(removedQuestions);
        }
        let question = {
            questionId: questionId,
            marks: questionMarks.value.trim()
        }
        let marks = parseInt(questionMarks.value);
        // console.log(marks);
        if (isNaN(marks)) {
            alert('invalid input type');
            return
        }
        selectedQuestions.set(questionId, question);
        let actionBtn = document.getElementById(`add-btn-${questionId}`);
        actionBtn.value = '-';
        actionBtn.onclick = () => removeQuestionInExam(questionId, actionBtn);
        //console.log(typeof(questionMarks.value));
        // console.log(selectedQuestions);

        let totalMarksTag = document.getElementById('total-marks');
        totalMarks = totalMarks + marks;

        totalMarksTag.innerText = totalMarks
        questionMarks.readOnly = true


    }
    //console.log(questionMarks);


}
function removeQuestionInExam(removeQuestionId, element) {

    //selectedQuestions.splice(selectedQuestions.findIndex(obj=>obj.questionId===removeQuestionId),1)
    removedQuestions.add(removeQuestionId);
    // console.log(removedQuestions);
    selectedQuestions.delete(removeQuestionId);
    const questionMarks = document.getElementById(`mark-${removeQuestionId}`);
    let totalMarksTag = document.getElementById('total-marks');
    let marks = parseInt(questionMarks.value);
    if (isNaN(marks)) {
        alert('invalid input type');
        return
    }
    totalMarks = totalMarks - marks;

    totalMarksTag.innerText = totalMarks

    element.value = '+';
    element.onclick = () => addQuestionInExam(removeQuestionId)
    // console.log(selectedQuestions);
    questionMarks.readOnly = false
}



//save exam question which are selected
async function saveQuestions(event) {
    console.log(selectedQuestions);
    if (selectedQuestions.size == 0) {
        alert('please select questions');
        return
    }
    //console.log(sendinQuestions);
    const questionArrya = [];

    for (let [key, value] of selectedQuestions) {
        questionArrya.push(value);

    }


    const removedArray = Array.from(removedQuestions);
    const payload = {
        examId: examId,
        selectedQuestions: questionArrya,
        removedArray: removedArray
    }
    try {
        var questionSaveResponse = await fetch('/exam-edit-question-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'requestTime': new Date().getTime()
            },
            body: JSON.stringify(payload)
        })
        // console.log(questionSaveResponse);

        questionSaveResponse = await questionSaveResponse.json();
        // console.log(questionSaveResponse);
        if (questionSaveResponse.status == 200) {
            leaveFlag = 1
            alert('Changes are saved');
            let element = document.getElementById('next')
            element.onclick = (event) => {
                // event.preventDefault();
                // document.getElementById("exam_Id").value = examId;
                // document.getElementById("go_to_edit_exam").submit();
                submitExamForm(examId, 1)
            }
        }
        else {
            alert(questionSaveResponse.message);
            return
        }
    }
    catch (error) {
        // console.log(error);
        alert('Something Went Wrong');
        return
    }


}
function goBack(event) {
    event.preventDefault()
    window.history.back()
}

function submitExamForm(examId, marks) {

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

    // Append form to the body
    document.body.appendChild(form);

    // Submit the form automatically
    form.submit();
    form.remove();
}
window.addEventListener('beforeunload', (event) => {
    if (leaveFlag == 0) {
        event.preventDefault();
    }
})



