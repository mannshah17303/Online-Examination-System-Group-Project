document.addEventListener("DOMContentLoaded", async function () {
  // console.log("Admin Category Script Loaded");
  await fetchCategories();
});

// -------------------- Fetching ALl Categories  -------------------- //
async function fetchCategories() {
  try {
    addLoader();

    setTimeout(() => {
      removeLoader();
    }, 500);

    const response = await fetch("/admin/category/list-all");
    const categoryList = await response.json();
    if (categoryList.success) {
      const categories = categoryList.data;
      // console.log(categories);

      displayCategories(categories);
    } else {
      alert("Something Went Wrong");
      if (categoryList.status == 400) {
        location.href = "/admin/login";
      }
      // console.error("Failed to fetch categories:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
function displayCategories(categories) {
  // console.log("Category", categories);
  const categoryTable = document.getElementById("category-table");
  categoryTable.innerHTML = "";

  // Ensure categories is always an array
  const categoryArray = Array.isArray(categories) ? categories : [categories];

  const table = document.createElement("table");
  table.classList.add("category-table");

  const headerRow = document.createElement("tr");
  const headerCell1 = document.createElement("th");
  headerCell1.textContent = "Category Name";
  const headerCell2 = document.createElement("th");
  headerCell2.textContent = "Actions";

  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);
  table.appendChild(headerRow);

  categoryArray.forEach((cate) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = cate.category_name;

    const actionCell = document.createElement("td");

    const viewButton = document.createElement("button");
    viewButton.textContent = "View";
    viewButton.onclick = () => viewCategoryWithQuestion(cate.category_id);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa fa-edit"></i>';
    editButton.onclick = () => editCategory(cate.category_id);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa fa-trash-o"></i>';
    deleteButton.onclick = () => deleteCategory(cate.category_id);

    actionCell.appendChild(viewButton);
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(actionCell);
    table.appendChild(row);
  });

  categoryTable.appendChild(table);
}
// -------------------- Searching categories --------------------
async function searchCategory() {
  const searchTerm = document.getElementById("search").value.trim();

  if (searchTerm.length === 0) {
    fetchCategories();
    return;
  }

  try {
    const response = await fetch(
      `/admin/category/search?term=${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();
    // console.log();
    if (data.success) {
      displayCategories(data.data);
    } else {
      console.error(data.message);
      displayCategories([]);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    displayCategories([]);
  }
}

// -------------------- Viewing Individual Categories along with Questions using fetch -------------------- //
function viewCategoryWithQuestion(categoryId) {
  window.location.href = `/que-bank/api/questions?categoryId=${categoryId}`;
}
async function editCategory(categoryId) {
  // console.log(`Editing category with ID: ${categoryId}`);
  currentCategoryId = categoryId;

  try {
    const response = await fetch(`/admin/category/update/${categoryId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.success) {
      populateEditForm(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Something Went Wrong. Please try again.");
  }
}
function populateEditForm(category) {
  const editForm = document.getElementById("editCategoryForm");
  const categoryNameInput = document.getElementById("editCategoryName");
  categoryNameInput.value = category.data.category_name;
  editForm.style.display = "block";
}
async function submitEditForm(categoryId) {
  const categoryName = document.getElementById("editCategoryName").value;
  try {
    const response = await fetch(`/admin/category/update/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category_name: categoryName }),
    });
    const data = await response.json();
    if (data.success) {
      alert(data.message);
      closeEditForm();
      fetchCategories();
    } else {
      alert(data.message);
    }
  } catch (error) {
    // console.error("Error updating category:", error);
    alert("Failed to update category. Please try again.");
  }
}
function closeEditForm() {
  const editForm = document.getElementById("editCategoryForm");
  editForm.style.display = "none"; // Hide the edit form
}

// -------------------- Deleting Indivudual Categories along with Ques using fetch -------------------- //
async function deleteCategory(categoryId) {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      const response = await fetch(`/admin/category/delete/${categoryId}`, {
        method: "delete",
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        await fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      // console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  }
}

// -------------------- Adding Categories use fetch -------------------- //
const modal = document.getElementById("myModal");
const closeModal = document.getElementById("closeModal");
const categoryForm = document.getElementById("categoryForm");

function openModal() {
  modal.style.display = "block";
}
closeModal.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
categoryForm.onsubmit = async function (event) {
  event.preventDefault();
  const categoryName = document.getElementById("categoryName").value;

  try {
    const response = await fetch("/admin/category/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category_name: categoryName }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // console.log("Category added successfully:", data);
        alert("Category added successfully");
        modal.style.display = "none";
        fetchCategories();
      } else {
        alert("Something Went Wrong. Please try again.");
      }
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    // console.error("Error adding category:", error);
    alert("Something Went Wrong. Please try again.");
  } finally {
    document.getElementById("categoryName").value = "";
  }
};
