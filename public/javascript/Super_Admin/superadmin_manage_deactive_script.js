document.addEventListener("DOMContentLoaded", async function () {
    await fetchAllDeactiveAdmins();
});

async function fetchAllDeactiveAdmins() {
    const response = await fetch('/super-admin/list-deactive-admins');
    if(response.ok){
        const admins = await response.json();
        // console.log(admins.data); //Array of admins
        const result = admins.data; 
        DisplayAdmins(result);
    }
}

let currentAdminId;
const activate_btn = document.getElementById('activateButton');
const deleteButton = document.getElementById('deleteButton');
const cancleButton = document.getElementById('cancleButton');

function DisplayAdmins(admins) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'admin-table';

    const header = document.createElement('thead');
    header.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
        </tr>
    `;
    table.appendChild(header);

    const tbody = document.createElement('tbody');
    admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admin.first_name} ${admin.last_name}</td>
            <td>${admin.email}</td>
            <td>
                <button class="reactivate-button" onclick="requestAdminAction(${admin.admin_id}, '${admin.first_name} ${admin.last_name}')">Manage</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    dataContainer.appendChild(table);
}

function requestAdminAction(adminId, adminName) {
    openAdminActionModal(adminId, adminName);
}

function openAdminActionModal(adminId, adminName) {
    currentAdminId = adminId;
    const adminActionMessage = document.getElementById('adminActionMessage');
    adminActionMessage.innerHTML = `<h4>Are you sure you want to activate or delete the admin:</h4><br><u><h3>${adminName}</h3></u>`;
    openModal('adminActionModal');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function activateAdmin() { 
    activate_btn.textContent = 'Processing...';    
    deleteButton.disabled = true;
    cancleButton.disabled = true;
    
    fetch(`/super-admin/activate-admin/${currentAdminId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Admin activated successfully.');
                activate_btn.textContent = 'Activated';
                deleteButton.disabled = false;
                cancleButton.disabled = false;
                closeModal('adminActionModal');
                fetchAllDeactiveAdmins();
            } else {
                activate_btn.textContent = 'Try Again';
                deleteButton.disabled = false;
                cancleButton.disabled = false;
                alert('Failed to activate admin.');
            }
        })
        .catch(error => {
            console.error('Error activating admin:', error);
            alert('An error occurred while activating the admin.');
        });
}

function deleteAdmin() {
    fetch(`/super-admin/delete-admin/${currentAdminId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Admin deleted successfully.');
                closeModal('adminActionModal');
                fetchAllDeactiveAdmins();
            } else {
                alert('Failed to delete admin.');
            }
        })
        .catch(error => {
            console.error('Error deleting admin:', error);
            alert('An error occurred while deleting the admin.');
        });
}