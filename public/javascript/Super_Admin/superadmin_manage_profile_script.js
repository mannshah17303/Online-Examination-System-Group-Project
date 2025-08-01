document.addEventListener('DOMContentLoaded', async () => {
    const id = document.getElementById('super-id').value;
    const response = await fetch(`/super-admin/profile/${id}`);

    if (response.ok) {
        const data = await response.json();
        const superAdmin = data.admin;
        Populate_Profile_Details(superAdmin[0])
    }
});

function Populate_Profile_Details(superAdmin) {
    document.getElementById('firstName').value = superAdmin.first_name;
    document.getElementById('lastName').value = superAdmin.last_name;
    document.getElementById('email').value = superAdmin.email;
    document.getElementById('address').value = superAdmin.address;

    // Create a Date object from the DOB string
    const dobDate = new Date(superAdmin.dob);
    const formattedDob = formatDateToYYYYMMDD(dobDate);
    document.getElementById('dob').value = formattedDob;
    // console.log(formattedDob);

    document.getElementById('mobile_number').value = superAdmin.mobile_number;
    document.getElementById('gender').value = superAdmin.gender;

    if (superAdmin.role === 1) {
        document.getElementById('role').value = "Super-Admin";
    }
}
function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function editProfile() {
    // Get input elements
    const fields = [
        document.getElementById('firstName'),
        document.getElementById('lastName'),
        document.getElementById('address'),
        document.getElementById('dob'),
        document.getElementById('mobile_number'),
        document.getElementById('gender')
    ];

    // Enable editing for each field
    fields.forEach(field => {
        field.removeAttribute('readonly');
        if (field.tagName === 'SELECT') {
            field.removeAttribute('disabled');
        }
        field.style.border = '2px solid #007bff';
    });

    // Focus on the first field
    fields[0].focus();

    // Toggle button visibility
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('update-btn').style.display = 'block';
}

async function updateProfile() {
    const profileForm = document.getElementById('profileForm');
    const superId = document.getElementById('super-id').value;
    const formData = new FormData(profileForm);
    try {
        const response = await fetch(`/super-admin/profile/${superId}`, {
            method: 'PUT',
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if(data.success === true){
            GenericPopup('Profile Updated Successfully');
            disableEditing();
        }
        if(data.status===400){
            GenericPopup_Failuer(data.data);
        }
    } catch (error) {
        GenericPopup('Error Updating Profile');
    }
}

function disableEditing() {
    // Get input elements
    const fields = [
        document.getElementById('firstName'),
        document.getElementById('lastName'),
        document.getElementById('address'),
        document.getElementById('dob'),
        document.getElementById('mobile_number'),
        document.getElementById('gender')
    ];

    // Disable editing for each field
    fields.forEach(field => {
        field.setAttribute('readonly', 'readonly');
        if (field.tagName === 'SELECT') {
            field.setAttribute('disabled', 'disabled');
        }
        field.style.border = '1px solid #01395f';
    });

    // Toggle button visibility
    document.getElementById('edit-btn').style.display = 'block';
    document.getElementById('update-btn').style.display = 'none';
}

function GenericPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out');
        popup.addEventListener('transitionend', () => {
            document.body.removeChild(popup);
        });
    }, 3000);
}

function GenericPopup_Failuer(message) {
    const popup = document.createElement('div');
    popup.className = 'popup_fail_msg';
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.add('fade-out_fail');
        popup.addEventListener('transitionend', () => {
            document.body.removeChild(popup);
        });
    }, 3000);
}

