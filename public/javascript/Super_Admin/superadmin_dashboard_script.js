document.addEventListener("DOMContentLoaded", async function () {
    // console.log("Dashboard Script Loaded");
});

// Function to show the loader
function showLoader() {
    document.getElementById('genericLoader').style.display = 'block';
    document.getElementById('backdrop').style.display = 'block';
}

// Function to hide the loader
function hideLoader() {
    document.getElementById('genericLoader').style.display = 'none';
    document.getElementById('backdrop').style.display = 'none';
}

async function logout() {
    showLoader();
    try {
        const response = await fetch('/super-admin/logout', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            hideLoader();
            alert(data.message);
            window.location.href = '/super-admin';
        } else {
            alert(data.message);
        }
    } catch (error) {
        hideLoader();
        console.error('Error during logout:', error);
        alert("Something went wrong, please try again.");
    }
}

function GoBack() {
    window.location.href = "/super-admin";
}

function Profile(){
    window.location.href = "/super-admin/manage-profile";
}