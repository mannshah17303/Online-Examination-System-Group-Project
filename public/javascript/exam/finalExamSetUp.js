
//get exam id from params
// const url = window.location.search;
// const urlParams = new URLSearchParams(url);
// const examId = urlParams.get('examId')
// //console.log(examId);

//to handle that user can not add more mark then total marks
var paperMarks = Number.POSITIVE_INFINITY

var batchList = new Set(); //handle unique batch entry

var studentList = new Set(); // handle unique student entry

window.addEventListener('load', async () => {
    loadExamInfo();
})
let nowDate = new Date().getTime() + 300000;

var leaveFlag = 0;

let startTimeElement = document.getElementById('start-time');
let endTimeElement = document.getElementById('end-time');

startTimeElement.min = getISTTime();
endTimeElement.min = getISTTime();
// let editButton = document.getElementById('edit');
// editButton.href = `/exam-question-edit?examId=${examId}`

//set previes button
// let previewExam = document.getElementById('preview');
// previewExam.href = `/preview?examId=${examId}`

//load basic information of exam
async function loadExamInfo() {
    try {
        var examInfoResponse = await fetch(`/get-basic-examdata?examId=${examId}`, {
            method: 'GET'
        })
        examInfoResponse = await examInfoResponse.json();
        //console.log(examInfoResponse);
        if (examInfoResponse.status == 200) {
            setInformationInField(examInfoResponse.data)
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

    const basicData = data.basicDataOfExam[0]; //basic exam information

    const questionCategories = data.QuecategoriesOfcreatedExams;  // category of selected question

    const batches = data.AllBatchesOfAdmin;  //total batch of admin

    //exam name
    document.getElementById('exam-name').value = basicData.exam_name

    //exam desription
    document.getElementById('exam-description').value = basicData.exam_description;

    //set category
    let categoryGrid = document.getElementById('category-grid')

    categoryGrid.innerHTML = ''

    for (let category of questionCategories) {
        let categoryBlock = document.createElement('div');
        categoryGrid.appendChild(categoryBlock);
        categoryBlock.setAttribute('class', 'category-block');
        categoryBlock.innerText = category.category_name
    }

    //set marks
    document.getElementById('total-marks').innerHTML = `Total Marks : ${basicData.total_marks}`;
    paperMarks = basicData.total_marks

    //drop down of batch
    let batchSelect = document.getElementById('batch');
    batchSelect.innerHTML = ''
    for (let batch of batches) {
        if (batch.is_deleted == 0) {
            let option = document.createElement('option');
            option.value = batch.batch_id;
            option.innerText = batch.batch_name;
            batchSelect.appendChild(option);
            //option.disabled=true
        }
    }

}

//add batch in set of batch
function addBatch() {
    //console.log(1);
    let batchField = document.getElementById('batch');
    let batchListDiv = document.getElementsByClassName('batch-list')[0];

    let batchValue = batchField.value;  // get value of batch from select

    // console.log(batchValue);
    if (batchValue) {
        if (batchList.has(batchValue)) {
            alert('batch already added');
            return;
        }
        let batch = batchField.querySelector(`option[value='${batchValue}']`);
        let batchName = batch.textContent;

        batchList.add(batchValue);
        //console.log(batch);
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

        //console.log(batchList);
    }
}

//remove batch from batch set
function removeBatch(batchValue, div) {
    let batchField = document.getElementById('batch');

    batchList.delete(batchValue)
    //console.log("remove value" + batchValue);
    let batch = batchField.querySelector(`option[value='${batchValue}']`);
    //console.log(batch);
    batch.disabled = false;
    div.remove();

}

// add student in studentList if student exist in system
async function addStudent() {
    let email = document.getElementById('individual-email').value
    let studentListDiv = document.getElementById('student-list');
    let dialogLoader = document.getElementById('loaderDialog');
    // console.log(email);
    try {
        dialogLoader.style.display = 'flex';
        var checkResponse = await fetch('/check-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email })
        })


        checkResponse = await checkResponse.json();
        dialogLoader.style.display = 'none';
        //console.log(checkResponse);
        if (checkResponse.status == 200) {
            const studentId = checkResponse.data
            //console.log(studentId);

            if (studentList.has(studentId)) {
                alert('You have already added student');
                return
            }
            else {
                studentList.add(studentId)
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


                studentListDiv.appendChild(studentDiv)
            }
            // console.log(studentList);
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

function removeStudent(studentId, element) {
    studentList.delete(studentId);
    element.remove()
    //console.log(studentList);
}

document.getElementById('finalExamSubmit').addEventListener('submit', async (event) => {

    event.preventDefault();
    const loader = document.getElementById('loader');


    let examName = document.getElementById('exam-name').value.trim()
    let examDescription = document.getElementById('exam-description').value.trim()
    let passingMarks = document.getElementById('passing-marks').value.trim()
    let startTime = document.getElementById('start-time').value
    let endTime = document.getElementById('end-time').value
    let duration = document.getElementById('duration').value.trim()
    let dialogLoader = document.getElementById('loaderDialog');
    //validation on submit
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
    //console.log(object);

    let batchArray = Array.from(batchList);

    let studentArray = Array.from(studentList);

    if (batchArray.length == 0 && studentArray.length == 0) {
        alert('Select batch or enter candidate');
        return
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
        studentArray: studentArray,
        currentTime: new Date().getTime()
    }
    //console.log(payload);
    dialogLoader.style.display = 'flex';

    var examSubmitResponse = await fetch('/create-exam-final', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    //console.log(examSubmitResponse);
    examSubmitResponse = await examSubmitResponse.json();

    dialogLoader.style.display = 'none';

    if (examSubmitResponse.status == 200) {
        leaveFlag = 1
        alert(examSubmitResponse.message);
        window.location.href = `/admin/manageExam`
    }
    else {
        alert(examSubmitResponse.message);
        return;
    }


})
function getISTTime() {
    let date = new Date()
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 35);

    let currentTimestamp = date.toISOString();

    let timestampDate = currentTimestamp.slice(0, 10);
    let currentHour = currentTimestamp.slice(11, 13);
    let currentMinute = currentTimestamp.slice(14, 16);
    let currentSecond = currentTimestamp.slice(17, 19);

    let time = currentHour + ":" + currentMinute
    let timestampInIST = timestampDate + 'T' + time;

    return timestampInIST;
}

function goBack(event) {
    event.preventDefault()
    window.history.back()
}

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
        console.log(error);
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

window.addEventListener('beforeunload', (event) => {
    if (leaveFlag == 0) {
        event.preventDefault();
    }
})
