document.getElementById('forgotPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const loader = document.getElementById('loader');

    loader.style.display = 'block';

    try {
        const response = await fetch('/super-admin/forgot-password', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        loader.style.display = 'none';

        if (data.success) {
            alert(data.message);
            window.location.href = '/super-admin';
        } else {
            alert(data.message);
        }
    } catch (error) {
        loader.style.display = 'none';
        console.error('Error during password reset:', error);
        alert("Something went wrong, please try again.");
    }
});
