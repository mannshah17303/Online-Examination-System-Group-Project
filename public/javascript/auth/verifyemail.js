window.onload=async()=>{
    try{
        let res = await fetch(`/verifyemail/${document.getElementById("token").innerHTML}`, {
        method: "post",
      });
      res = await res.json();
      // console.log(res);
      
    //   sessionStorage.clear()
    //   sessionStorage.setItem("auth",res.data.token)
    //   sessionStorage.setItem("id",res.data.id)
      location.href='/student/dashboard'//dashboard
    }catch(err){
        // console.log("err",err);
        location.href='/singup'
    }
}