
//get examId from params
// const url = window.location.search;
// const urlParams = new URLSearchParams(url);
// const examId = document.getElementById("examId").innerHTML;
// console.log(examId);

//handle marksnot greater then total marks
var paperMarks = Number.POSITIVE_INFINITY

var batchList = new Set();//handle new inserted batch

var newStudentList = new Set();// handle new inserted student

var removedStudenList = new Set(); // handle removed student from selected previousaly

var selectedStudent;
const selectedStudentSet=new Set();
let nowDate = new Date().getTime() + 300000; //date time object with plush 5 mins

var questionFlag = 1;

var leaveFlag = 0;

//load basic info
window.addEventListener('load', async () => {
    loadExamInfo();
})

//edit button
let editButton = document.getElementById('edit');
editButton.onclick = (event) => {
    event.preventDefault();
    submitExamForm(examId, '')
}

//preview button
// let previewExam = document.getElementById('preview');
// previewExam.href = `/preview?examId=${examId}`

let startTimeElement = document.getElementById('start-time');
let endTimeElement = document.getElementById('end-time');

startTimeElement.min = getCurrentISTTime();
endTimeElement.min = getCurrentISTTime();

//make requesto for data
async function loadExamInfo() {
    try {
        var examInfoResponse = await fetch(`/edit-basic-examdata?examId=${examId}`, {
            method: 'GET',
            headers: {
                'requestTime': new Date().getTime()
            }
        })
        examInfoResponse = await examInfoResponse.json();
        // console.log(examInfoResponse);
        if (examInfoResponse.status == 200) {
            setInformationInField(examInfoResponse.data)
            // console.log(examInfoResponse.data);
        }
        else {
            alert(examInfoResponse.message);
            location.href = `/admin/manageExam`
            return
        }


    } catch (error) {
        // console.log(error);
        alert("something went wrong");
        return
    }
}

//set information in page
function setInformationInField(data) {

    const questionCategories = data.QuecategoriesOfcreatedExams; // selected uestion category

    if (questionCategories.length == 0) {
        // location.href = `exam-question-edit?examId=${examId}`
        submitExamForm(examId, null)
    }

    const basicData = data.basicDataOfExam[0]; //basic info

    const batches = data.AllBatchesOfAdmin; //All batch of admin

    selectedStudent = data.selectedStudents;// selected student
    if(selectedStudent.length>0){
       selectedStudent.forEach((obj)=>{
        selectedStudentSet.add(obj.student_id)
       })
    }
   
    //console.log(selectedStudentSet);

    var selectedBatch = data.selectedBatches.map((obj) => obj.batch_id); // make array of selected batch

    //exam name
    document.getElementById('exam-name').value = basicData.exam_name

    //exam desription
    document.getElementById('exam-description').value = basicData.exam_description;

    //set category
    let categoryGrid = document.getElementById('category-grid')

    categoryGrid.innerHTML = ''

    //category div content
    for (let category of questionCategories) {
        let categoryBlock = document.createElement('div');
        categoryGrid.appendChild(categoryBlock);
        categoryBlock.setAttribute('class', 'category-block');
        categoryBlock.innerText = category.category_name
    }

    //set marks
    document.getElementById('total-marks').innerHTML = `Total Marks : ${basicData.total_marks}`;
    paperMarks = basicData.total_marks

    // set paasing marks
    // console.log(basicData.passing_marks);
    let passingMarksElement = document.getElementById('passing-marks')
    passingMarksElement.value = basicData.passing_marks


    if (basicData.exam_start_datetime) {
        document.getElementById('start-time').value = getISTTime(basicData.exam_start_datetime)
    }

    if (basicData.exam_end_datetime) {
        document.getElementById('end-time').value = getISTTime(basicData.exam_end_datetime)
    }


    //duration
    let duration = document.getElementById('duration');
    duration.value = basicData.duration

    //drop down
    let batchSelect = document.getElementById('batch');
    batchSelect.innerHTML = ''

    //if batch is in selected batch array then it will not given in option
    for (let batch of batches) {
        if (batch.is_deleted == 0) {
            if (!selectedBatch.includes(batch.batch_id)) {
                let option = document.createElement('option');
                option.value = batch.batch_id;
                option.innerText = batch.batch_name;

                batchSelect.appendChild(option);
            }
            //option.disabled=true
        }
    }


    //listimg of previousaly selected student
    let selectedStudentDiv = document.getElementById('selected-student');
    // console.log(selectedStudent);

    if (selectedStudent.length > 0) {
        let title = document.createElement('h3');
        title.textContent = 'Selected Students:'
        selectedStudentDiv.appendChild(title);

    }
    else {
        selectedStudentDiv.remove();
    }
    let studentList = document.createElement('div');
    studentList.setAttribute('class', 'selected-student-list');
    selectedStudentDiv.appendChild(studentList);
    for (let student of selectedStudent) {

        let studentDiv = document.createElement('div');
        studentDiv.setAttribute('class', 'student');
        let studentEmail = document.createElement('div');
        studentEmail.setAttribute('class', 'student-email');
        studentEmail.innerText = student.email;
        studentDiv.appendChild(studentEmail);

        let removeBtn = document.createElement('input');
        removeBtn.type = 'button';
        removeBtn.value = '-';
        removeBtn.onclick = () => removeSelectedStudent(student.student_id, studentDiv);

        studentDiv.appendChild(removeBtn)

        studentList.appendChild(studentDiv)
    }


}

//remove student and add in removestudent set for remove
function removeSelectedStudent(studentId, element) {
    removedStudenList.add(studentId);
  //  console.log(removedStudenList);


    selectedStudentSet.delete(studentId)
    element.remove();

}

//add batch in batch set
function addBatch() {
    // console.log(1);
    let batchField = document.getElementById('batch');
    let batchListDiv = document.getElementsByClassName('batch-list')[0];

    let batchValue = batchField.value;

    // console.log(batchValue);
    if (batchValue) {

        if (batchList.has(batchValue)) {
            // console.log("in alert");
            alert('batch already added');
            return;
        }
        let batch = batchField.querySelector(`option[value='${batchValue}']`);
        let batchName = batch.textContent;

        batchList.add(batchValue);
        // console.log(batch);
        batch.disabled = true


        // console.log(batchName);
        let batchInfo = document.createElement('div');
        batchInfo.setAttribute('class', 'batch-info');
        batchListDiv.appendChild(batchInfo);

        let batchNameDiv = document.createElement('div');
        batchNameDiv.setAttribute('class', 'batch-name');
        batchInfo.appendChild(batchNameDiv);
        batchNameDiv.innerHTML = `${batchName}`

        let batchRemoveDiv = document.createElement('div');
        batchRemoveDiv.setAttribute('class', 'remove-batch');
        batchInfo.appendChild(batchRemoveDiv);

        let removeBtn = document.createElement('input');
        removeBtn.type = 'button';
        removeBtn.value = '-';
        removeBtn.onclick = () => removeBatch(batchValue, batchInfo);
        batchRemoveDiv.appendChild(removeBtn);

        // console.log(batchList);
    }
}

//remove batch from batch set
function removeBatch(batchValue, div) {
    let batchField = document.getElementById('batch');

    batchList.delete(batchValue)
    // console.log("remove value" + batchValue);
    let batch = batchField.querySelector(`option[value='${batchValue}']`);
    // console.log(batch);

    batch.disabled = false;
    div.remove();


}

//add new student in newstudent set , it will be validate if student exist in system or not
async function addStudent() {
    let email = document.getElementById('individual-email').value
    let studentListDiv = document.getElementById('student-list');
    let dialogLoader = document.getElementById('loaderDialog');
    // console.log(loader);
    // console.log(email);
    try {
        dialogLoader.style.display = 'flex'
        var checkResponse = await fetch('/check-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ 'email': email })
        })


        checkResponse = await checkResponse.json();
        dialogLoader.style.display = 'none'
        //loader.style.display='none'
        //console.log(checkResponse);
        if (checkResponse.status == 200) {
            const studentId = checkResponse.data
            // console.log(studentId);

            if (newStudentList.has(studentId)) {
                alert('You have already added student');
                return
            }
            else {
                newStudentList.add(studentId)

                let studentDiv = document.createElement('div');
                studentDiv.setAttribute('class', 'student');
                let studentEmail = document.createElement('div');
                studentEmail.setAttribute('class', 'student-email');
                studentEmail.innerText = email;
                studentDiv.appendChild(studentEmail);
                document.getElementById('individual-email').value=''
                let removeBtn = document.createElement('input');
                removeBtn.type = 'button';
                removeBtn.value = '-';
                removeBtn.onclick = () => removeStudent(studentId, studentDiv);

                studentDiv.appendChild(removeBtn)


                studentListDiv.appendChild(studentDiv);

            }
            // console.log(newStudentList);
        }
        else {
            alert(checkResponse.message)
            return
        }

    }
    catch (error) {
        // console.log(error);
        alert('something went wrong!!')
        return
    }

}

//remove student from newStudent set
function removeStudent(studentId, element) {
    newStudentList.delete(studentId);
    element.remove()
    // console.log(newStudentList);
}

let finalExamSubmit = document.getElementById('finalExamSubmit')
//handle submit 
finalExamSubmit.addEventListener('submit', async (event) => {
    event.preventDefault();
    let dialogLoader = document.getElementById('loaderDialog');
    let examName = document.getElementById('exam-name').value.trim()
    let examDescription = document.getElementById('exam-description').value.trim()
    let passingMarks = document.getElementById('passing-marks').value.trim()
    let startTime = document.getElementById('start-time').value
    let endTime = document.getElementById('end-time').value
    let duration = document.getElementById('duration').value.trim()


    //validations of form
    if(passingMarks<0){
        alert('Passing marks must be greater then or equal to 0');
        return;
    }
    if (passingMarks > paperMarks) {
        alert('Passing marks must less then total marks')
        return;
    }
    if (((new Date(startTime).getTime()) < nowDate) || ((new Date(endTime).getTime()) < nowDate)) {
        alert('enter valid date and time also it must be 5 minute after current time');
        return
    }
    if (startTime > endTime) {
        alert('enter valid start and end time');
        return
    }
    if (isNaN(parseInt(duration))) {
        alert('enter valid duration');
        return
    }

    //converting set to array
    let batchArray = Array.from(batchList);
    let newStudentArray = Array.from(newStudentList);
    let removeStudentArray = Array.from(removedStudenList);
    console.log(batchArray.length);
    console.log( newStudentArray.length );
    console.log(selectedStudentSet.size);
    if (selectedStudentSet.size == 0 && batchArray.length == 0 && newStudentArray.length == 0) {
        alert('Select student or batch');
        return;
    }
    const payload = {
        examId: examId,
        examName: examName,
        examDescription: examDescription,
        passingMarks: passingMarks,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        batchArray: batchArray,
        newStudentArray: newStudentArray,
        removeStudentArray: removeStudentArray,
        currentTime: new Date().getTime()

    }
    // console.log(payload);
    dialogLoader.style.display = 'flex';
    var examSubmitResponse = await fetch('/edit-final-exam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'requestTime': new Date().getTime()
        },
        body: JSON.stringify(payload)
    })
    // console.log(examSubmitResponse);
    examSubmitResponse = await examSubmitResponse.json();
    dialogLoader.style.display = 'none';
    if (examSubmitResponse.status == 200) {
        leaveFlag = 1
        alert(examSubmitResponse.message);
        // window.removeEventListener();
        location.href = `/admin/manageExam`
    }
    else {
        alert(examSubmitResponse.message);
        return;
    }

})

//convert utc time to ist
function getISTTime(str) {
    let date = new Date(str)
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    let currentTimestamp = date.toISOString();

    let timestampDate = currentTimestamp.slice(0, 10);
    let currentHour = currentTimestamp.slice(11, 13);
    let currentMinute = currentTimestamp.slice(14, 16);
    let currentSecond = currentTimestamp.slice(17, 19);

    let time = currentHour + ":" + currentMinute + ":" + currentSecond;
    let timestampInIST = timestampDate + ' ' + time;

    return timestampInIST;
}

//get current ist time for local date time
function getCurrentISTTime() {
    let date = new Date()
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 35);

    let currentTimestamp = date.toISOString();

    let timestampDate = currentTimestamp.slice(0, 10);
    let currentHour = currentTimestamp.slice(11, 13);
    let currentMinute = currentTimestamp.slice(14, 16);


    let time = currentHour + ":" + currentMinute
    let timestampInIST = timestampDate + 'T' + time;

    return timestampInIST;
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


    document.body.appendChild(form);

    form.submit();
}


getPreview(examId);

//preview exam function
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

        let str = ''
        document.getElementById('previewHead').innerHTML = `
            <div id='head'>
                <div id='left'>
                    <div>Exam Name : <span>${exambasic.exam_name}</span></div>
                    <div>Exam Description : <span>${exambasic.exam_description}</span></div>
                </div>
                <div id='right'>
                    <div onClick='closePreview()' id=close><i class="fa-solid fa-xmark"></i></div>
                </div>
            </div>`

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

let previewPop = document.getElementById('previewPop')
let sidebarMainDiv = document.querySelector('.sidebarMainDiv');
let back = document.getElementById('back')
function showPreview() {
    previewPop.style.display = 'block'
    finalExamSubmit.classList.add('addStyle')
    sidebarMainDiv.classList.add("addStyle")
    back.classList.add('addStyle')
}

function closePreview() {
    previewPop.style.display = 'none'
    finalExamSubmit.classList.remove('addStyle')
    sidebarMainDiv.classList.remove("addStyle")
    back.classList.remove('addStyle')
}



//delete exam 
document.getElementById('delete').onclick = (event) => {
    event.preventDefault();
    deleteExam(examId)
}

async function deleteExam(examId) {
    const result = confirm('Do you want to delete this exam');
    try {
        if (result) {
            // console.log('yes', examId);

            var deleteResponse = await fetch(`/delete-exam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ examId: examId })
            });

            deleteResponse = await deleteResponse.json();

            if (deleteResponse.status == 200) {
                leaveFlag = 1
                alert(deleteResponse.message);
                location.href = `/admin/manageExam`
            }
            else {
                alert(deleteResponse.message);
                return
            }

        }
        else {
            return
        }

    } catch (error) {

    }
}

//ensure that user save information
window.addEventListener('beforeunload', (event) => {
    if (leaveFlag == 0) {
        event.preventDefault();
    }
})

