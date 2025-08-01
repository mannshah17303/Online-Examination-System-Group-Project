document.addEventListener("DOMContentLoaded", async function () {
    // console.log("Dashboard Logical Script Loaded.");
    createCardLayout();
});

function createCardLayout() {
    const cardContainer = document.querySelector('.card-container');

    const links = [
        { href: "/super-admin/manage-profile", text: "Manage Profile", imgSrc: "/logo/profile.svg" },
        { href: "/super-admin/manage-admins", text: "Manage Admins", imgSrc: "/logo/manage.svg" },
        { href: "/super-admin/add-admin-page", text: "Add Admins", imgSrc: "/logo/add.svg" },
        { href: "/super-admin/deactive-admins", text: "Deactivated Admins", imgSrc: "/logo/deactivate.svg" },
        { href: "/super-admin/construction", text: "Manage Plans", imgSrc: "/logo/price.svg" },
        { href: "/super-admin/construction", text: "Manage Website", imgSrc: "/logo/website.svg" },
    ];

    links.forEach(link => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        cardHeader.textContent = link.text;
        // create hr
        const hr = document.createElement("hr");
        hr.classList.add("card-hr");
        cardHeader.appendChild(hr);

        const cardImg = document.createElement("div");
        cardImg.classList.add("card-img");
        const img = document.createElement("img");
        img.src = link.imgSrc;
        img.alt = link.text;
        img.style.width = "100px";
        cardImg.appendChild(img);

        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");
        const cardLink = document.createElement("a");
        cardLink.href = link.href;
        cardLink.textContent = "Go to " + link.text;
        cardContent.appendChild(cardLink);

        card.appendChild(cardHeader);
        card.appendChild(cardImg);
        card.appendChild(cardContent);
        cardContainer.appendChild(card);
    });
}