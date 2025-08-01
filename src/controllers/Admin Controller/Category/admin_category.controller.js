import { responseObj } from "../../../utils/responseObj.js";

import {
  fetchAllCategories,
  addCategory,
  fetchCategoryById,
  fetchCategoryById_For_Edit,
  updateCategoryInDatabase,
  deleteCategoryFromDatabase,
  fetchCategoriesBySearchTerm,
} from "../../../database/Admin Database Query/Category/dbQuery_category_query.js";

export const categoryPage = (req, res) => {
  res.render("admin/category", {
    layout: "layouts/admin-layout.ejs",
  });
};

// Listing all categories
export const List_All_Category = async (req, res) => {
  const adminSessionId = req.userId;
  try {
    const category = await fetchAllCategories(adminSessionId);
    const response = responseObj(true, 200, "Category List", category);
    // console.log(category);

    res.json(response);
  } catch (err) {
    // console.log(err);

    const response = responseObj(500, "Internal Server Error", null);
    res.json(response);
  }
};

// Search categories based on the search term
export const searchCategories = async (req, res) => {
  const adminSessionId = req.userId;
  const searchTerm = req.query.term;

  try {
    const categories = await fetchCategoriesBySearchTerm(adminSessionId, searchTerm);

    // Ensure categories is always an array
    const responseCategories = Array.isArray(categories) ? categories : [categories];

    const response = responseObj(true, 200, "Category List", responseCategories);
    res.json(response);
  } catch (err) {
    // console.log(err);
    const response = responseObj(500, "Internal Server Error", null);
    res.json(response);
  }
};


// Adding Category
export const Add_Category = async (req, res) => {
  const adminId = req.userId;

  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res
        .status(400)
        .json(responseObj(false, 400, "Category name is required", null));
    }

    const category = await addCategory(category_name, adminId);

    if (category.success) {
      const response = responseObj(true, 200, "Category Added", category.data);
      // console.log("Category added successfully:", response);
      return res.status(200).json(response);
    } else {
      const response = responseObj(false, 400, category.message, null);
      // console.log("Category already present:", response);
      return res.status(400).json(response);
    }
  } catch (error) {
    // console.error("Internal Server Error:", error);
    const response = responseObj(false, 500, "Internal Server Error", null);
    return res.status(500).json(response);
  }
};

// View Individual Category by id along with Ques
export const View_Single_Category = async (req, res) => {
  try {
    // const adminSessionId = req.session.adminSessionId;
    const adminSessionId = req.userId;
    const { category_id } = req.params;
    const categoryById = await fetchCategoryById(category_id, adminSessionId);
    if (!categoryById) {
      return res
        .status(404)
        .json(responseObj(false, 404, "Category not found", null));
    }
    const response = responseObj(true, 200, "Category retrieved successfully");
    res.status(200).json(response);
  } catch (error) {
    // console.error("Error retrieving category:", error);
    const response = responseObj(false, 500, "Internal Server Error", null);
    res.status(500).json(response);
  }
};

// Fetching the data for Editing the Category
export const Fetch_EditCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await fetchCategoryById_For_Edit(id);
    if (!category) {
      return res
        .status(404)
        .json(responseObj(false, 404, "Category not found", null));
    }
    const response = responseObj(
      true,
      200,
      "Category retrieved successfully",
      category
    );
    res.status(200).json(response);
  } catch (error) {
    // console.error("Error fetching category:", error);
    const response = responseObj(false, 500, "Internal Server Error", null);
    res.status(500).json(response);
  }
};
export const EditCategory = async (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  try {
    if (!category_name) {
      return res
        .status(400)
        .json(responseObj(false, 400, "Category name is required", null));
    }
    const result = await updateCategoryInDatabase(id, category_name);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(responseObj(false, 404, "Category not found", null));
    }
    const response = responseObj(
      true,
      200,
      "Category updated successfully",
      null
    );
    res.status(200).json(response);
  } catch (error) {
    // console.error("Error updating category:", error);
    const response = responseObj(false, 500, "Internal Server Error", null);
    res.status(500).json(response);
  }
};

// Deleting the Category
export const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const result = await deleteCategoryFromDatabase(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(responseObj(false, 404, "Category not found", null));
    }
    const response = responseObj(
      true,
      200,
      "Category deleted successfully",
      null
    );
    res.status(200).json(response);
  } catch (error) {
    // console.error("Error deleting category:", error);
    const response = responseObj(false, 500, "Internal Server Error", null);
    res.status(500).json(response);
  }
};