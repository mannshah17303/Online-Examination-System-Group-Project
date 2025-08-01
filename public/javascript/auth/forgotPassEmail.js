const myform = document.getElementById("myform");

myform.onsubmit = async (e) => {
  try{
    addLoader();
    e.preventDefault();
    let data;
    let role = location.href;
    if (role.includes("candidate")) {
      let res = await fetch("/forgot-pass-email/candidate", {
        method: "post",
        body: new FormData(myform),
      });
      data=await res.json()
      removeLoader();
      if(!data.success){
        throw new Error(data)
      }
    } else {
      let res = await fetch("/forgot-pass-email/admin", {
        method: "post",
        body: new FormData(myform),
      });
      data=await res.json()
      removeLoader();
      if(!data.success){
        throw new Error(data)
      }
    }
    // document.getElementById("msg").style.display = "block";
    window.alert(data.message)
    location.href='/'
  }catch(err){
    if(err="Error: 402"){
      window.alert("account doesn't exsist")
      location.href='/login'
    }else{
      window.alert('Try after some time')
      // console.log("err",err);
    }
  }
};
