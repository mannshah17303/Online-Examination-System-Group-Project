//window.onload = loadCategoryData;

//manage which manage question and its marks in form of object (key:questionId,value:{questionId:QuestionId,marks:marks})
var selectedQuestions = new Map();

//get examId from params
// const url = window.location.search;
// const urlParams = new URLSearchParams(url);
// const examId = urlParams.get('examId');
// const examId=window.examId
//total mark to handle total marks of question on run time
var totalMarks = 0

var leaveFlag = 0;
document.getElementById('total-marks').innerText = totalMarks

// console.log(examId);

//onload all question oof all category and all type will load and basic information will set
window.addEventListener('load', async () => {
    setExamdetail()
    loadCategoryData();
    var questionData = await fetch(`/get-question?categoryId=all&questionType=all`, {
        method: 'GET'
    });
    questionData = await questionData.json();
    // console.log(questionData);
    listQuestions(questionData);
})


//load category data in drop down of category
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

    //first option to select all tyep and category
    let option = document.createElement('option');
    option.value = 'all';
    option.textContent = 'All';
    categorySelect.appendChild(option);

    for (let category of categories) {
        let option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.category_name;
        categorySelect.appendChild(option);
    }

}

//handle question on category change
document.getElementById('category').addEventListener('change', async () => {
    let categoryId = document.getElementById('category').value;
    let questionType = document.getElementById('question-type').value
    var questionData = await fetch(`/get-question?categoryId=${categoryId}&questionType=${questionType}`, {
        method: 'GET'
    });
    questionData = await questionData.json();
    listQuestions(questionData)

})
//handle question on type of question change
document.getElementById('question-type').addEventListener('change', async () => {
    let categoryId = document.getElementById('category').value;
    let questionType = document.getElementById('question-type').value
    var questionData = await fetch(`/get-question?categoryId=${categoryId}&questionType=${questionType}`, {
        method: 'GET'
    });
    questionData = await questionData.json();
    listQuestions(questionData)
})

//list question according to drop down filter
function listQuestions(questionData) {
    //console.log(questionData);
    let questionList = document.getElementById('question-list');
    questionList.innerHTML = '';

    //get data of question 
    const questions = questionData.data;

    //handle index of question
    let questionIndex = 1;

    //list type wise question
    for (let data of questions) {

        if (data.questionType == 'MCQ') {

            let question = document.createElement('div');
            questionList.appendChild(question);
            question.setAttribute('class', 'question');

            //question and options

            //queston-content div
            let questionContent = document.createElement('div');
            question.appendChild(questionContent);
            questionContent.setAttribute('class', 'question-content');

            //question text container div
            let questionText = document.createElement('div');
            questionContent.appendChild(questionText);
            questionText.innerText = `${questionIndex}) ${data.questionText}`;
            questionIndex++;

            //option div container to hold all question
            let optionContainer = document.createElement('div');
            questionContent.appendChild(optionContainer);
            optionContainer.setAttribute('class', 'option-container');

            //handle option index in single question
            let optionIndex = 65;

            //console.log(data.options);
            for (let option of data.options) {

                let optionText = document.createElement('div');
                optionContainer.appendChild(optionText);

                let index = String.fromCharCode(optionIndex);  // convert asci code to charecter

                optionText.innerText = `${index}) ${option.optionText}`

                if (option.isCorrect == '1') {
                    optionText.style.color = 'green';   //haldle option if it is correct          
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

            //check if question is already selected in selectedquestion map
            if (selectedQuestions.has(data.questionId)) {

                //get selected question from selectedQuestion map
                const tempQuestionObj = selectedQuestions.get(data.questionId);

                //if already question selected then remove button provided
                let addBtn = document.createElement('input');
                addBtn.type = 'button';
                addBtn.value = '-';
                addBtn.id = `add-btn-${data.questionId}`
                addBtn.onclick = () => removeQuestionInExam(data.questionId);
                questionAddBtnDiv.appendChild(addBtn);

                //marks container div
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
                marksInput.readOnly = true  //if question is added then user only have readonly access of input field 
                marksInput.value = tempQuestionObj.marks  //add marks from selected question map object
                marksLabel.appendChild(marksInput);
            }
            else  // if question is not selected
            {

                // adda button to add question
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
            }





        }
        else  // subjective type question handling
        {

            let question = document.createElement('div');
            questionList.appendChild(question);
            question.setAttribute('class', 'question');


            //question and options

            let questionContent = document.createElement('div');
            question.appendChild(questionContent);
            questionContent.setAttribute('class', 'question-content');

            let questionText = document.createElement('div');
            questionContent.appendChild(questionText);
            questionText.innerText = `${questionIndex}) ${data.questionText}`;
            questionIndex++;

            //  const ans = data.options[0]
            //console.log(ans);

            // let optionContainer = document.createElement('div');
            // questionContent.appendChild(optionContainer);
            // optionContainer.setAttribute('class', 'answer-container');

            //optionContainer.innerHTML = `Answer :<span style="color:green"> ${ans}<span>`

            let questionAction = document.createElement('div');
            question.appendChild(questionAction);
            questionAction.setAttribute('class', 'question-action');

            let questionAddBtnDiv = document.createElement('div');
            questionAction.appendChild(questionAddBtnDiv);
            questionAction.setAttribute('class', 'question-add-btn');

            if (selectedQuestions.has(data.questionId)) {

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

            } else {

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
            }

        }


    }

}

//function to add question in selectedQuestion map
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

        let question = {
            questionId: questionId,
            marks: questionMarks.value.trim()
        }

        //make sure marke is integer value
        let marks = parseInt(questionMarks.value);

        if (isNaN(marks)) {
            alert('invalid input type');
            return
        }

        selectedQuestions.set(questionId, question); // add question in selectedQuestion map

        let actionBtn = document.getElementById(`add-btn-${questionId}`);   // change add button to remove button
        actionBtn.value = '-';
        actionBtn.onclick = () => removeQuestionInExam(questionId, actionBtn);
        //console.log(typeof(questionMarks.value));
        //console.log(selectedQuestions);

        //make track of total marks
        let totalMarksTag = document.getElementById('total-marks');
        totalMarks = totalMarks + marks;

        totalMarksTag.innerText = totalMarks
        questionMarks.readOnly = true


    }
    //console.log(questionMarks);


}

//remove question from selectedQuestion map
function removeQuestionInExam(removeQuestionId, element) {

    selectedQuestions.delete(removeQuestionId); //delete from map

    const questionMarks = document.getElementById(`mark-${removeQuestionId}`);
    let totalMarksTag = document.getElementById('total-marks');
    let marks = parseInt(questionMarks.value);
    if (isNaN(marks)) {
        alert('invalid input type');
        return
    }
    //remove marks from total
    totalMarks = totalMarks - marks;

    totalMarksTag.innerText = totalMarks

    element.value = '+';
    element.onclick = () => addQuestionInExam(removeQuestionId)
    // console.log(selectedQuestions);
    questionMarks.readOnly = false
}

async function saveQuestions() {
    if (selectedQuestions.size == 0) {
        alert('please select questions');
        return;
    }
    //console.log(sendinQuestions);
    const questionArrya = [];

    //make object array of question id and marks from map
    for (let [key, value] of selectedQuestions) {
        questionArrya.push(value);

    }

    const payload = {
        examId: examId,
        selectedQuestions: questionArrya
    }
    try {
        var questionSaveResponse = await fetch('/add-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        // console.log(questionSaveResponse);

        questionSaveResponse = await questionSaveResponse.json();
        // console.log(questionSaveResponse);
        if (questionSaveResponse.status == 200) {
            alert('Changes are saved')
            leaveFlag = 1;
            let element = document.getElementById('next')
            //element.href = `/exam-setup?examId=${examId}`
            //element.onclick=''
            element.onclick = (event) => {
                event.preventDefault();
                createExam(examId, 1)
            }
        }
        else {
            alert(questionSaveResponse.message);
            location.href = `/admin/manageExam`
            return
        }
    }
    catch (error) {
        // console.log(error);


        alert('Something Went Wrong');
        return
    }


}

async function setExamdetail() {
    var examDetail = await fetch(`/get-exam-detail?examId=${examId}`, {
        method: 'GET'
    })
    examDetail = await examDetail.json();
    //console.log(examDetail);
    document.getElementById('exam-name').innerText = `${examDetail.data.exam_name}`;

}


function goBack(event) {
    event.preventDefault()
    window.history.back()
}

function createExam(examId, marks) {
    // Create a form element
    let form = document.createElement("form");
    form.action = "/exam";
    form.method = "post";
    form.style.display = "none";

    // Create the examId input field
    let examIdInput = document.createElement("input");
    examIdInput.type = "text";
    examIdInput.name = "examId";
    examIdInput.value = examId;
    examIdInput.readOnly = true;

    // Create the marks input field
    let marksInput = document.createElement("input");
    marksInput.type = "text";
    marksInput.name = "marks";
    marksInput.value = marks;
    marksInput.readOnly = true;

    // Create the submit button
    let submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Submit";

    // Append all elements to the form
    form.appendChild(examIdInput);
    form.appendChild(marksInput);
    form.appendChild(submitButton);

    // Append form to the body
    document.body.appendChild(form);

    // Submit the form automatically
    form.submit();
    form.remove()
}

window.addEventListener('beforeunload', (event) => {
    if (leaveFlag == 0) {
        event.preventDefault();
    }
})
