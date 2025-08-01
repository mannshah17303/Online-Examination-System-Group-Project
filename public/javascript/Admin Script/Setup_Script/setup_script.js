document.addEventListener("DOMContentLoaded", async function () {
    await Populate_Admin_Data();
});

async function Populate_Admin_Data() {
    const response = await fetch('/decode-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: new URLSearchParams(window.location.search).get('token') })
    });

    if (response.ok) {
        const data = await response.json();
        const user_data = data.data;
        PopulateData(user_data)
    } else {
        // console.log("Error");
        alert("Something Went Wrong");
    }
}

function PopulateData(user_data) {
    document.getElementById('first_name').value = user_data.f_name;
    document.getElementById('last_name').value = user_data.l_name;
    document.getElementById('email').value = user_data.email;
    document.getElementById('mobile_number').value = user_data.mobile_number;
    document.getElementById('gender').value = user_data.gender;
    document.getElementById('aadhar_number').value = user_data.aadhar_number;
}

// async function Send_Admin_Data() {
//     const data = document.getElementById('setup_form');
//     const formData = new FormData(data);
//     showLoader_1();

//     const email = formData.get('email');
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         hideLoader_1();
//         GenericPopup_Failuer("Please enter a valid email address.");
//         return;
//     }

//     try {
//         const send_data = await fetch('/add-admin-data', {
//             method: 'POST',
//             body: formData
//         });

//         const responseData = await send_data.json();
//         console.log('Server response:', responseData);
//         hideLoader_1();

//         if (responseData.success) {
//             GenericPopup("Admin added successfully!");
//             setTimeout(() => {
//                 window.location.href = '/thankyou-page';
//             }, 3000);
//         } else {
//             // Handle specific error cases
//             if (responseData.status === 409) {
//                 GenericPopup_Failuer("You are already registered. Redirecting you.");
//                 setTimeout(() => {
//                     window.location.href = '/thankyou-page';
//                 }, 4000);
//             } else if (responseData.status === 400) {
//                 GenericPopup_Failuer("Error: Unable to add admin. Please check your input and try again.");
//             } else {
//                 GenericPopup_Failuer(`Error: ${responseData.data || 'An unexpected error occurred.'}`);
//             }
//         }
//     } catch (error) {
//         hideLoader_1();
//         console.error("Client-side error:", error);
//         GenericPopup_Failuer("An unexpected error occurred. Please try again later.");
//     }
// }
async function Send_Admin_Data(e) {
    const data = document.getElementById('setup_form');
    const formData = new FormData(data);
    showLoader_1();

    try {
        const send_data = await fetch('/add-admin-data', {
            method: 'POST',
            body: formData
        });

        const responseData = await send_data.json();
        console.log('Server response:', responseData);
        hideLoader_1();

        if (responseData.success) {
            GenericPopup("Admin added successfully!");
            setTimeout(() => {
                window.location.href = '/thankyou-page';
            }, 3000);
        } else {
            // Handle specific error cases
            if (responseData.status === 403) {
                GenericPopup_Failuer(responseData.data || "This email is registered as a student. Please use a different email or contact support.");
                setTimeout(() => {
                    window.location.href = '/thankyou-page';
                }, 3000);
            } else if (responseData.status === 409) {
                GenericPopup_Failuer("This email is already registered as an admin. Redirecting you to login page.");
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 3000);
            } else if (responseData.status === 400) {
                GenericPopup_Failuer("Unable to add admin. Please check your input and try again.");
            } 
            else if (responseData.status === 500) {
                GenericPopup_Failuer("This email is registered as a student and cannot be used for an admin account");
            } 
            else {
                GenericPopup_Failuer(`${responseData.data || 'An unexpected error occurred.'}`);
            }
        }
    } catch (error) {
        hideLoader_1();
        console.error("Client-side error:", error);
        GenericPopup_Failuer("An unexpected error occurred. Please try again later.");
    }
}

function showLoader_1() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader_1() {
    document.getElementById('loader').style.display = 'none';
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