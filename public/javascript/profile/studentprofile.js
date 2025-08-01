document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});
let content = document.getElementById("content");

async function getProfile() {
  const url = "/api/student/profile";
  try {
    const response = await fetch(url);
    const json = await response.json();
    if (!json.success) {
      throw new Error(json.status);
    }

    // console.log(json)
    let data = json.data[0];
    let f = data.first_name;
    let l = data.last_name;
    let check = f.split("")[0] + l.split("")[0];
    // console.log(data)
    let str = ` <div id="heading">
                <h2>Profile Section</h2>
                <a href="/student/editProfile">Edit Profile</a>
            </div>
            <div id="line"></div>
            <div id="profile-card">
                <div id="profile">
                    <div id='pfp'>${check.toUpperCase()}</div>
                    <p class='profile-data'>First Name <span>${data.first_name}</span></p>
                    <p class='profile-data'>Last Name <span>${data.last_name}</span></p>
                    <p class='profile-data'>Email <span>${data.email}</span></p>
                </div>
            </div>`;
    content.innerHTML = str;
  } catch (error) {
    if (error.message == 400) {
      alert("Something Went Wrong");
      location.href = "/login";
    }
    console.error(error.message);
  }
}

getProfile();
