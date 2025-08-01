let form = document.getElementById('form')
let username = document.getElementById('username')
let email = document.getElementById('email')


async function getProfile() {
    const url = "/api/student/profile";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      let data = json.data[0]
      // console.log(data)
      firstName.value = data.first_name
      lastName.value = data.last_name
      email.value = data.email
      
    } catch (error) {
      console.error(error.message);
    }
  }


getProfile()
form.addEventListener('submit',async(e)=>{
  e.preventDefault()
  let data = {
    firstName : firstName.value,
    lastName: lastName.value
  }
  // console.log(data)

  const response = await fetch('/api/student/editprofile',{
    method: 'POST',
    headers : {
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(data)
  })
  const json = await response.json()
  if(json.success){
    alert(json.message)
    location.href='/student/profile'
  }else{
    alert(json.message)
  }
})
