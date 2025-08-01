let form = document.getElementById('form')
let firstname = document.getElementById('firstname')
let lastname = document.getElementById('lastname')
let dob = document.getElementById('dob')
let email = document.getElementById('email')
let number = document.getElementById('number')
let role = document.getElementById('role')
let address = document.getElementById('address')
let aadhar = document.getElementById('aadhar')
let gender_div = document.getElementById('gender_div')
let designation = document.getElementById('designation')
let organization = document.getElementById('organization')
let experience = document.getElementById('experience')
let speciality = document.getElementById('speciality')
let gender = document.getElementById('gender')
let male = document.getElementById('male')
let female = document.getElementById('female')

// make the aadhar and email fields style
email.classList.add('non-editable');
aadhar.classList.add('non-editable');

email.setAttribute('disabled', true);
aadhar.setAttribute('disabled', true);


async function getProfile() {
  const url = "/api/admin/profile";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    let data = json.data[0]
    // console.log(data)
    firstname.value = data.first_name
    lastname.value = data.last_name
    dob.value = data.dob == '' ? '-' : (data.dob).split('T')[0]
    email.value = data.email == '' ? '-' : data.email
    number.value = data.mobile_number == '' ? '-' : data.mobile_number
    role.value = data.role == 0 ? 'Admin' : 'Super Admin'
    address.value = data.address == '' ? '-' : data.address
    aadhar.value = data.aadhar_number == '' ? '-' : data.aadhar_number

    if (data.gender == 'male' || data.gender == 'Male') {
      male.checked = true
    } else {
      female.checked = true
    }

    designation.value = data.designation == '' ? '-' : data.designation
    organization.value = data.organization_name == '' ? '-' : data.organization_name
    experience.value = data.years_of_experience == '' ? '-' : data.years_of_experience
    speciality.value = data.field_of_speciality == '' ? '-' : data.field_of_speciality

  } catch (error) {
    console.error(error.message);
  }
}

getProfile()

form.addEventListener('submit', async (e) => {
  let gender = ''
  e.preventDefault()
  if (male.checked) {
    gender = 'Male'
  } else {
    gender = 'Female'
  }

  let data = {
    firstname: firstname.value,
    lastname: lastname.value,
    dob: dob.value,
    mobile_number: number.value,
    address: address.value,
    gender: gender,
    designation: designation.value,
    organization: organization.value,
    experience: experience.value,
    speciality: speciality.value,
  }
  // console.log(data)

  const response = await fetch('/api/admin/editprofile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const json = await response.json()
  if (json.success) {
    alert(json.message)
    location.href = '/admin/profile'
  } else {
    alert(json.message)
  }
})
