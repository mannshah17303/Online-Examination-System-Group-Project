document.addEventListener("DOMContentLoaded", async function () {
    await fetchAllAdmins();
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.classList.remove('show');
}

async function fetchAllAdmins() {
    const response = await fetch('/super-admin/list-all-admins');
    if (response.ok) {
        const admin = await response.json();
        // console.log(admin.data);
        Listing_All_Admins(admin.data);
    }
    else {
        // console.log("Error");
        alert("Something Went Wrong")
    }
}

function Listing_All_Admins(admins) {
    const dataContainer = document.querySelector('.data-container');
    dataContainer.innerHTML = '';

    admins.forEach(admin => {
        const adminCard = document.createElement('div');
        adminCard.className = 'admin-card';

        const adminDetails = document.createElement('div');
        adminDetails.className = 'admin-details';
        adminDetails.innerHTML = `
            <h3>${admin.first_name} ${admin.last_name}</h3>
            <p><strong>Email:</strong> ${admin.email}</p>
        `;

        // const actionDropdown = document.createElement('select');
        // actionDropdown.className = 'action-dropdown';
        const adminDeleteBtn = document.createElement('button');
        adminDeleteBtn.type = 'button';
        adminDeleteBtn.id = `adminDeleteBtn_${admin.admin_id}`;
        adminDeleteBtn.classList.add('action-dropdown');
        adminDeleteBtn.innerHTML = `Deactivate`;
        adminDeleteBtn.addEventListener("click", () => {
            deleteAdmin(admin.admin_id, admin.email)
        })
        // actionDropdown.innerHTML = `Deactivate`;
        // <option value="">Action</option>
        // <option value="delete">Deactivate</option>

        adminDetails.addEventListener('click', () => {
            viewAdmin(admin);
        });

        // document.querySelectorAll('[id^="adminDeleteBtn_"]').forEach(btn => {
        //     btn.addEventListener("click", () => {
        //         deleteAdmin(btn.id.substring(15), admin.email);
        //     })
        // })

        // actionDropdown.addEventListener('change', (event) => {
        //     const action = event.target.value;
        //     if (action === 'delete') {
        //         deleteAdmin(admin.admin_id, admin.email);
        //     }
        //     actionDropdown.value = '';
        // });

        adminCard.appendChild(adminDetails);
        adminCard.appendChild(adminDeleteBtn);
        // adminCard.appendChild(actionDropdown);
        dataContainer.appendChild(adminCard);
    });
}

function viewAdmin(admin) {
    // console.log(admin);
    const viewAdminDetails = document.getElementById('viewAdminDetails');
    const h2 = document.createElement('h2');
    h2.textContent = `${admin.first_name} ${admin.last_name} : Details`;
    viewAdminDetails.appendChild(h2);

    const createdAt = new Date(admin.created_at);

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    const created_at_Date = createdAt.toLocaleString('en-US', options);

    const options_dob = { year: 'numeric', month: 'long', day: 'numeric' };
    const dob = new Date(admin.dob);
    // Format the dob date
    const dob_Format_Date = dob.toLocaleString('en-US', options_dob);
    // console.log('Date of Birth:', dob_Format_Date);

    viewAdminDetails.innerHTML = `
        <h2>Details of - ${admin.first_name} ${admin.last_name}</h2>
        <hr>
        <table>
            <tr>
                <td><strong>Full Name:</strong></td>
                <td><input type="text" value="${admin.first_name} ${admin.last_name}" readonly></td>
            </tr>
            <tr>
                <td><strong>Verified Email:</strong></td>
                <td><input type="email" value="${admin.email}" readonly></td>
            </tr>
            <tr>
                <td><strong>User Role:</strong></td>
                <td><input type="text" value="Admin" readonly></td>
            </tr>
            <tr>
                <td><strong>Admin Created At:</strong></td>
                <td><input type="text" value="${created_at_Date}" readonly></td>
            </tr>
            <tr>
                <td><strong>Admin Aadhar Number:</strong></td>
                <td><input type="text" value="${admin.aadhar_number}" readonly></td>
            </tr>
             <tr>
                <td><strong>Admin Address:</strong></td>
                <td><input type="text" value="${admin.address}" readonly></td>
            </tr>
             <tr>
                <td><strong>Admin Designation:</strong></td>
                <td><input type="text" value="${admin.designation}" readonly></td>
            </tr>
             <tr>
                <td><strong>Admin DOB:</strong></td>
                <td><input type="text" value="${dob_Format_Date}" readonly></td>
            </tr>
            <tr>
                <td><strong>Admin Mobile Number:</strong></td>
                <td><input type="text" value="${admin.mobile_number}" readonly></td>
            </tr>
            <tr>
                <td><strong>Admin Organization Name:</strong></td>
                <td><input type="text" value="${admin.organization_name}" readonly></td>
            </tr>
        </table>
    `;
    openModal('viewAdminModal');
}

// function deleteAdmin(adminId, email) {
//     console.log("Admin Delete ID is:", adminId, email);

//     const confirmDeleteButton = document.getElementById('confirmDeleteButton');

//     confirmDeleteButton.onclick = async () => {
//         try {
//             const response = await fetch(`/super-admin/deactivate-admin/${adminId}`);
//             if (!response.ok) {
//                 throw new Error('Failed to delete admin');
//             }
//             if(response.ok){
//                 const emailResponse = await fetch('/super-admin/send-deactivation-email', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ email, adminId }),
//                 });

//                 if (!emailResponse.ok) {
//                     throw new Error('Failed to send email');
//                 }
//                 if (emailResponse.ok) {
//                     closeModal('deleteAdminModal');
//                     alert("Admin Deactivated successfully and email sent.");
//                 }
//                 closeModal('deleteAdminModal');
//                 await fetchAllAdmins();
//             }
//         } catch (error) {
//             alert("Error Deleting Admin: " + error.message);
//         }
//     };
//     openModal('deleteAdminModal');
// }

async function deleteAdmin(adminId, email) {
    // console.log("Initiating admin deletion:", { adminId, email });

    try {
        openModal('deleteAdminModal');
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');

        // Remove any existing event listeners to prevent multiple bindings
        confirmDeleteButton.replaceWith(confirmDeleteButton.cloneNode(true));
        const newConfirmButton = document.getElementById('confirmDeleteButton');
        const cancleButton = document.getElementById('cancleButton');

        newConfirmButton.onclick = async () => {
            try {
                newConfirmButton.disabled = true;
                newConfirmButton.textContent = 'Processing...';
                cancleButton.disabled = true;


                const deactivateResponse = await fetch(`/super-admin/deactivate-admin/${adminId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!deactivateResponse.ok) {
                    cancleButton.disabled = false;
                    throw new Error('Failed to deactivate admin account');
                }

                const emailResponse = await fetch('/super-admin/send-deactivation-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, adminId }),
                });

                if (!emailResponse.ok) {
                    cancleButton.disabled = false;
                    deleteAdminModal_span.disabled = false;
                    throw new Error('Failed to send deactivation email');
                }

                if(emailResponse.ok){
                    closeModal('deleteAdminModal');
                    alert('Admin deactivated successfully and email sent.');
                    await fetchAllAdmins();
                }
            } catch (error) {
                console.error('Error in deletion process:', error);
                alert(`Error: ${error.message}`);
            } finally {
                // Reset button state
                newConfirmButton.disabled = false;
                newConfirmButton.textContent = 'Confirm';
            }
        };

    } catch (error) {
        console.error('Error setting up deletion:', error);
        alert(`Setup Error: ${error.message}`);
        closeModal('deleteAdminModal');
    }
}