document.addEventListener("DOMContentLoaded", async function () {
  addLoader();
  setTimeout(() => {
    removeLoader();
  }, 500);
});

let content = document.getElementById("content");

async function getProfile() {
  const url = "/api/admin/profile";
  try {
    const response = await fetch(url);

    const json = await response.json();
    // console.log(json);

    if (!json.success) {
      throw new Error(json.status);
    }
    let data = json.data[0];
    // console.log(data);
    let f = data.first_name;
    let l = data.last_name;
    let check = f.split("")[0] + l.split("")[0];
    let str = '';
    str += `
      <style>
        #pfp {
          margin: 0;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        #img-side p {
          margin: 0;
          font-size: 18px;
        }
        #fname {
          font-weight: bold;
          font-size: 20px;
        }
        .profile h3 {
          margin: 0 0 15px;
          font-size: 20px;
          color: #333;
        }
        .data div {
          display: flex;
          margin-bottom: 10px;
        }
        .data label {
          width: 150px;
          font-weight: bold;
        }
        .data input[readonly] {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
          color: #333;
          font-size: 16px;
          cursor: not-allowed;
        }
        .data input[readonly]:focus {
          outline: none;
          border-color: #ccc;
        }
      </style>
      <div id="heading">
        <h2>Profile Section</h2>
        <a href="/admin/editProfile">Edit Profile</a>
      </div>
      
      <div id="profile">
        <div id="profile-first">
          <div id="img">
            <p id="pfp">${check.toUpperCase()}</p>
          </div>
          <div id="img-side">
            <p id="fname">${data.first_name} ${data.last_name}</p>`;
    if (data.role == 0) {
      str += `<p>Admin</p>`;
    }

    if (data.field_of_speciality == '') {
      str += `N/A`;
    } else {
      str += `<p>${data.field_of_speciality}</p>`;
    }
    str += `</div>
        </div>
        <div id="profile-sec">
          <div id="personal" class="profile">
            <h3>Personal Information</h3>
            <div class="data">
              <div><label>First Name</label><input readonly value="${data.first_name == '' ? '-' : data.first_name}"></div>
              <div><label>Last Name</label><input readonly value="${data.last_name == '' ? '-' : data.last_name}"></div>
              <div><label>Date Of Birth</label><input readonly value="${data.dob == '' ? '-' : (data.dob).split('T')[0]}"></div>
              <div><label>Email</label><input readonly value="${data.email == '' ? '-' : data.email}"></div>
              <div><label>Number</label><input readonly value="${data.mobile_number == '' ? '-' : data.mobile_number}"></div>`;
    if (data.role == 0) {
      str += `<div><label>Role</label><input readonly value="Admin"></div>`;
    }
    str += `<div><label>Address</label><input readonly value="${data.address == '' ? '-' : data.address}"></div>
            <div><label>Aadhar Number</label><input readonly value="${data.aadhar_number == '' ? '-' : data.aadhar_number}"></div>
            <div><label>Gender</label><input readonly value="${data.gender == '' ? '-' : data.gender}"></div>
          </div>
        </div>
        <div id="other" class="profile">
          <h3>Other Information</h3>
          <div class="data">
            <div><label>Designation</label><input readonly value="${data.designation == '' ? '-' : data.designation}"></div>
            <div><label>Organization Name</label><input readonly value="${data.organization_name == '' ? '-' : data.organization_name}"></div>
            <div><label>Year of Experience</label><input readonly value="${data.years_of_experience == '' ? '-' : data.years_of_experience}"></div>
            <div><label>Speciality</label><input readonly value="${data.field_of_speciality == '' ? '-' : data.field_of_speciality}"></div>
            <div><label>Total Views</label><input readonly value="${data.total_views === '' ? '-' : data.total_views}"></div>
          </div>
        </div>
      </div>`;
    content.innerHTML = str;
  } catch (error) {
    if (error.message == 400) {
      alert("Authentication failed");
      location.href = "/admin/login";
    }
    console.error(error.message);
  }
}

getProfile();
