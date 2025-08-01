const myform = document.getElementById("myform");

async function setUrl() {
  let atag = document.getElementById("forgot");
  let url = location.href;
  // console.log(url);
  let href = "/forgot-pass-email/";
  if (url.includes("superadmin")) {
    href += "superadmin";
  } else if (url.includes("admin")) {
    href += "admin";
  } else {
    href += "candidate";
  }
  atag.href = href;
}

async function checkauth() {
  try {
    let url = location.href;
    // console.log(url);

    if (url.includes("superadmin")) {
    } else if (url.includes("admin")) {
      let res = await fetch("/admin/checkauth");
      res = await res.json();
      // console.log(res);

      if (res.status == 200) {
        location.href = "/dashboard-admin";
      }
    }
  } catch (error) {
    // console.log(error);
  }
}
checkauth();

myform.onsubmit = async (e) => {
  addLoader();
  e.preventDefault();
  let url = location.href;
  // console.log(url);
  // console.log(myform);
  let res;
  const data = new FormData(myform);
  let res_data;
  // console.log(...data);
  try {
    if (url.includes("superadmin")) {
      res = await fetch("/api/auth/login/superadmin", {
        method: "post",
        body: data,
      });
      res = await res.json();
      // res_data = res.data;
      // console.log(res);
    } else if (url.includes("admin")) {
      res = await fetch("/api/auth/login/admin", {
        method: "post",
        body: data,
      });
      res = await res.json();
      // res_data = res.data;
      // console.log(res);
    } else {
      res = await fetch("/api/auth/login/candidate", {
        method: "post",
        body: data,
      });
      res = await res.json();
      // console.log(res);
    }

    removeLoader();

    if (res.success) {
      // alert("login successfully");
      // console.log(res.data);
      if (res.data == "admin") {
        location.href = `/dashboard-admin`; //dashboard
      } else if (res.data == "superadmin") {
        location.href = `/dashboard-superadmin`;
      } else {
        location.href = `/student/dashboard`;
      }
    } else {
      alert("Email or password is wrong try again!!");
    }
  } catch (err) {
    // console.log("err", err);
  }
};
