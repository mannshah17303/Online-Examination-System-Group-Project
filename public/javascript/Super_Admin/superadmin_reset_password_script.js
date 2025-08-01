document.getElementById('resetPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get token from query
    const token = new URLSearchParams(window.location.search).get('token');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // console.log(token);
    // console.log(newPassword);
    // console.log(confirmPassword);

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch('/super-admin/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Password has been reset successfully.");
            window.location.href = '/super-admin'; // Redirect to the desired page after successful reset
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        alert("Something went wrong, please try again.");
    }
});