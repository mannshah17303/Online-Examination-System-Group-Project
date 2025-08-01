let studentData = [];

let page_count_ele=document.getElementById("page_count")
    let current_page=document.getElementById("current_page")
    let main_con=document.getElementById("main_con");
    let search_box=document.getElementById("search_box")
    window.onload=async()=>{
        try{
            let data = await examdata(1);
            let page_count=Math.ceil((data.data.length)/5)
            page_count_ele.innerHTML=page_count;
            // console.log(data.data);
            change_main_con(data.data.examData)
        }catch(err){
            // console.log("err",err);
        }
    }
    function examdata(page,like){
        return new Promise(async(res,rej)=>{
            try{
                let response=await fetch('/api/result/get-exam-result',{
                    headers:{
                        "Content-Type": "application/json"
                    },
                    method:"post",
                    body:JSON.stringify({
                        "created_by":1,
                        "page":page,
                        "like":like
                    })
                })
                let data=await response.json();
                res(data);
            }catch(err){
                rej(err);
            }
        })
    }
    async function change_con(e) {
        // console.log(e.innerHTML);
        if(e.innerHTML=="&lt;&lt;"){
            //<<
            current_page.innerHTML=1;
        }else if(e.innerHTML==" prev "){
            if(current_page.innerHTML!=1){
                current_page.innerHTML--;
            }
        }else if(e.innerHTML==" next"){
            if(current_page.innerHTML!=page_count_ele.innerHTML)
            current_page.innerHTML++;
        }else if(e.innerHTML==" &gt;&gt;"){
            //>>
            current_page.innerHTML=page_count_ele.innerHTML;
        }else{
            current_page.innerHTML=1;
        }
        try{
            let data = await examdata(current_page.innerHTML,search_box.value);
            let page_count=Math.ceil((data.data.length)/5)
            page_count_ele.innerHTML=page_count;
            // console.log(data.data);
            change_main_con(data.data.examData)
        }catch(err){
            console.log("err",err);
        }
    }
    function change_main_con(examData){
        main_con.innerHTML=``;
        let count=0;
        if(examData.length==0){
          main_con.innerHTML=`No candidate found`
        }else{
          examData.forEach(e=>{
              let percentage=(e.pass_candidate/e.present_candidate)*100;
              count++;
              let new_div=document.createElement('div');
              new_div.className="con";
              new_div.innerHTML=`<span>${count}</span><span>${e.exam_name}</span><span>${e.present_candidate}/${e.invited_candidate}</span><span>${percentage}%</span><span onclick='getExamStudentData(${e.exam_id})' class="btn">View student Result</span>`;
              main_con.appendChild(new_div);        
          })
        }
    }
async function getExamStudentData(id) {
  let res = await fetch("/api/result/get-exam-student-result", {
    headers: {
      "content-type": "application/json",
    },
    method: "post",
    body: JSON.stringify({ exam_id: id }),
  });
  res = await res.json();
  let examdata = res.data.examData[0];
  // console.log(examdata);
  document.getElementById(
    "examData"
  ).innerHTML = `<h4>Exam name: ${examdata.exam_name}</h4><div><span><b>Total mark: </b>${examdata.total_marks}</span><span><b>Passing mark: </b>${examdata.passing_marks}</span>`;
  let data = res.data.studentData;

  studentData = data;
  let html = "";
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      html += ` <div class="row">
                  <p>${i + 1}</p>
                  <p>${data[i].first_name} ${data[i].last_name}</p>
                  <p>${data[i].obtained_marks}</p>
                  <p>${data[i].PassOrFail}</p>
                </div>`;
    }
    document.getElementById("all-data").style.overflowY =
      data.length > 3 ? "scroll" : "hidden";
  } else {
    html += "<p>No candidate found</p>";
  }
  document.getElementById("get-data").innerHTML = html;
  let d = document.getElementById("dialog");
  d.showModal();
  // console.log(data);
}

function closeDig() {
  document.getElementById("dialog").close();
}

document.getElementById("search").addEventListener("keyup", () => {
  let search = document.getElementById("search").value;
  let data = studentData.filter(
    (e) => e.first_name.includes(search) || e.last_name.includes(search)
  );
  // console.log(data);
  let html = "";
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      html += ` <div class="row">
                  <p>${i + 1}</p>
                  <p>${data[i].first_name} ${data[i].last_name}</p>
                  <p>${data[i].obtained_marks}</p>
                  <p>${data[i].PassOrFail}</p>
                </div>`;
    }
    document.getElementById("all-data").style.overflowY =
      data.length > 5 ? "scroll" : "hidden";
  } else {
    html += "<p>No candidate found</p>";
  }
  document.getElementById("get-data").innerHTML = html;
});
