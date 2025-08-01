async function checkauth() {
    try {
        let res = await fetch("/admin/checkauth");
        res = await res.json();
        // console.log(res);

        if (res.status == 400) {
            location.href = "/admin/login";
        }
    } catch (error) {
        console.log(error);
    }
}

checkauth();

document
    .getElementById("exam-create")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        // get value of name and and description
        let name = document.getElementById("exam-name").value.trim();
        let description = document.getElementById("exam_description").value.trim();

        const payload = {
            exam_name: name,
            exam_description: description,
        };

        try {

            var examCreateResponse = await fetch('/create-exam-stage1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            // console.log(examCreateResponse);

            examCreateResponse = await examCreateResponse.json();

            const examId = examCreateResponse.data;

            if (examCreateResponse.status == 200) {
                //window.location.href = `/exam-question?examId=${examId}`;  //redirect to exam question selection page
                createExam(examId, null)
            }
            else {
                alert(examCreateResponse.message);
                // location.href = `/admin/manageExam`
                return
            }
        }
        catch (error) {
            alert('Something Went Wrong')
            console.log(error);
            return
        }


    })

function createExam(examId, marks) {

    let form = document.createElement("form");
    form.action = "/exam";
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
    form.remove();
}
