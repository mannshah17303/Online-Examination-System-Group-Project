window.onload = async () => {
  let flag = document.getElementById("flag").innerHTML;
  // console.log(flag);
  if (flag == 0) {
    let html = `<div>
      <h2>Link is Already used.</h2>
    </div>`;
    document.getElementsByTagName("body")[0].innerHTML = html;
  }
};
const myform = document.getElementById("myform");

myform.onsubmit = async (e) => {
// document.getElementById("msg").style = "block";
try {
e.preventDefault();
let token = document.getElementById("token").innerHTML;
// console.log(token);
let res = await fetch(`/forgot-pass/${token}`, {
method: "post",
body: new FormData(myform),
});
res = await res.json();
// console.log(res);
if(res.success){
alert(res.message);
location.href = "/login";
}else{
// console.log(res.message);
document.getElementById("pwdErr").innerHTML=``;
document.getElementById("passwordErr").innerHTML=``;
let err = res.message;
err.forEach((msg) => {
  if(msg.message.includes("Confirm")){
    document.getElementById("pwdErr").innerHTML=`${msg.message}`
  }else{
    document.getElementById("passwordErr").innerHTML=`${msg.message}`
  }
})
}
} catch (err) {
console.log("err", err);
}
};



