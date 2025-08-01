const myform = document.getElementById("myform");
myform.onsubmit = async (e) => {
  try {
    addLoader();
    e.preventDefault();
    let url = location.href;
    // console.log(url);
    document.getElementById("fnameErr").innerHTML = "";
    document.getElementById("lnameErr").innerHTML = "";
    document.getElementById("phoneErr").innerHTML = "";
    document.getElementById("emailErr").innerHTML = "";
    document.getElementById("passErr").innerHTML = "";

    const data = new FormData(myform);
    // console.log(data);
    let res;
    if (url.includes("superadmin")) {
      res = await fetch("/api/auth/superadmin/signup", {
        method: "post",
        body: data,
      });
    } else if (url.includes("admin")) {
      res = await fetch("/api/auth/admin/signup", {
        method: "post",
        body: data,
      });
    } else {
      res = await fetch("/api/auth/signup", {
        method: "post",
        body: data,
      });
    }
    res = await res.json();
    
    removeLoader();

    // console.log(res);
    if (res.success) {
      alert('Email has been sent on given mail id activate your account from there');
      location.href = '/';
    }else if(res.status==402){
      window.alert(res.message)
      // document.getElementById("emailsent").style.display = "block";
    } else {
      let err = res.message;
      err.forEach((msg) => {
        if (msg.message.includes("First")) {
          document.getElementById("fnameErr").innerHTML = msg.message;
        } else if (msg.message.includes("Last")) {
          document.getElementById("lnameErr").innerHTML = msg.message;
        } else if (msg.message.includes("Phone")) {
          document.getElementById("phoneErr").innerHTML = msg.message;
        } else if (msg.message.includes("Email")) {
          document.getElementById("emailErr").innerHTML = msg.message;
        } else if (msg.message.includes("Password")) {
          document.getElementById("passErr").innerHTML = msg.message;
        }
      });
    }
  } catch (err) {
    // console.log("err", err);
  }
};
