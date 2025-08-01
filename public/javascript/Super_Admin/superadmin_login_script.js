document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const loader = document.getElementById('loader');

    loader.style.display = 'block';

    try {
        const response = await fetch('/super-admin/login', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        loader.style.display = 'none';

        if (data.success) {
            window.location.href = '/super-admin/dashboard';
        } else {
            alert(data.message);
        }
    } catch (error) {
        loader.style.display = 'none';
        console.error('Error during login:', error);
        alert("Something went wrong, try again.");
    }
});