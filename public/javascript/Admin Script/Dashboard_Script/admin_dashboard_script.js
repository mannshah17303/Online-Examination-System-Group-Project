async function checkauth() {
  try {
    let res = await fetch("/admin/checkauth");
    res = await res.json();
    // console.log(res);

    if (res.status == 400) {
      location.href = "/admin/login";
    }
  } catch (error) {


    // console.log(error);
  }
}

checkauth();

// Dropdown menu js
document.addEventListener("DOMContentLoaded", function () {
  const manageLink = document.getElementById("manageLink");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const manageCategoryLink = document.getElementById("manageCategoryLink");
  const categoryDropdownMenu = document.getElementById("categoryDropdownMenu");

    manageLink.addEventListener('click', function (event) {
        event.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        categoryDropdownMenu.style.display = 'none';
    });

    manageCategoryLink.addEventListener('click', function (event) {
        event.preventDefault();
        categoryDropdownMenu.style.display = categoryDropdownMenu.style.display === 'block' ? 'none' : 'block';
        dropdownMenu.style.display = 'none';
    });

  window.addEventListener("click", function (event) {
    if (
      !manageLink.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.style.display = "none";
    }
    if (
      !manageCategoryLink.contains(event.target) &&
      !categoryDropdownMenu.contains(event.target)
    ) {
      categoryDropdownMenu.style.display = "none";
    }
  });
});
