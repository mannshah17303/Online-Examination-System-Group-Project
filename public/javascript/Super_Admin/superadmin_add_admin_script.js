document.getElementById('add_form_id').addEventListener('submit', async function (event) {
    event.preventDefault();

    showLoader_1();

    const data = document.getElementById('add_form_id');
    const formData = new FormData(data);
    // console.log(formData);

    try {
        const response = await fetch('/super-admin/send-admin-data', {
            method: 'POST',
            body: formData,
        });

        hideLoader_1();

        if (response.ok) {
            const data = await response.json();
            // console.log(data);
            if (data.status === 200) {
                GenericPopup('Email Sent Successfully');
                setTimeout(() => {
                    window.location.href = '/super-admin/dashboard';
                }, 3000); 
            }
            if (data.status === 400) {
                GenericPopup_Failuer(data.data);
                return;
            }
        } else {
            GenericPopup_Failuer('An error occurred while processing your request.');
            return;
        }
    } catch (error) {
        console.error('Error:', error);
        hideLoader_1();
        GenericPopup_Failuer('There was an error submitting the form.');
        return;
    }
});

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