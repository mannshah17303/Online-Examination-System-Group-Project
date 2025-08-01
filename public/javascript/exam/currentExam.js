
window.addEventListener('load', async () => {
    getData()
})

//fetch data of current exam
async function getData() {
    try {
        var responseData = await fetch(`/current-exam-data`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ examId: examId })
        })
        responseData = await responseData.json();
        listData(responseData);
    } catch (error) {
        console.log(error);
        alert("something went wrong")
        return
    }

}
//view current exam
document.getElementById('preview').onclick = (event) => {
    event.preventDefault()
    showPreview();
}

//list data of active and inactive
async function listData(data) {
    const activeStudent = data.data.activeCandidates;
    const invitedStudents = data.data.invitedStudents;

    //set contain active student id
    var active = new Set();

   // console.log('active', activeStudent.length);
    //console.log('inactive', invitedStudents.length);

    activeStudent.map(obj => active.add(obj.student_id));
   // console.log(active);

    var activeDiv = document.getElementById('active-student');
    var inactiveDiv = document.getElementById('inactive-student');
    activeDiv.innerHTML = '';
    inactiveDiv.innerHTML = '';

    //count of total invaited
    document.getElementById('total-invited').innerText = invitedStudents.length;


    for (let student of invitedStudents) {
        if (active.has(student.student_id)) {
            const studentDiv = document.createElement("div");
            studentDiv.classList.add("student");

            //student info div
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("name");
            nameDiv.textContent = student.first_name + " " + student.last_name 

            const emailDiv = document.createElement("div");
            emailDiv.classList.add("email");
            emailDiv.textContent = student.email; 

            const statusDiv = document.createElement("div");
            statusDiv.classList.add("status");
            statusDiv.textContent = "Active"; 

            studentDiv.appendChild(nameDiv);
            studentDiv.appendChild(emailDiv);
            studentDiv.appendChild(statusDiv);

            activeDiv.appendChild(studentDiv);
        }
        else {
            const studentDiv = document.createElement("div");
            studentDiv.classList.add("student");

            // student info  divs
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("name");
            nameDiv.textContent = student.first_name + " " + student.last_name 

            const emailDiv = document.createElement("div");
            emailDiv.classList.add("email");
            emailDiv.textContent = student.email; 

            const statusDiv = document.createElement("div");
            statusDiv.classList.add("status");
            statusDiv.textContent = "Inctive"; 

           
            studentDiv.appendChild(nameDiv);
            studentDiv.appendChild(emailDiv);
            studentDiv.appendChild(statusDiv);

            inactiveDiv.appendChild(studentDiv);
        }
    }

    //if no active student
    if (active.size == 0) {
        activeDiv.innerHTML += 'No Active Candidate Found';
        activeDiv.classList.add('student')
    }
    //console.log(inactiveDiv.childNodes.length);
    if (inactiveDiv.childNodes.length == 0) {
        inactiveDiv.innerHTML += 'No Inactive Candidate Found';
        inactiveDiv.classList.add('student')
    }

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

let conrtainer = document.getElementsByClassName('conrtainer')[0]
let sidebarMainDiv = document.querySelector('.sidebarMainDiv')
function showPreview() {
    previewPop.style.display = 'block'
    conrtainer.classList.add('addStyle')
    sidebarMainDiv.classList.add("addStyle")
}

function closePreview() {
    previewPop.style.display = 'none'
    conrtainer.classList.remove('addStyle')
    sidebarMainDiv.classList.remove("addStyle")
}