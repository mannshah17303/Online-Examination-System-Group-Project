//show categories for exam create page
import { databaseQuery } from "../../database/databaseQuery.js"
import { responseObj } from "../../utils/responseObj.js";

// get category for exam question selection page for particaular admin
export const getCategoriesForExam = async (req, res) => {
  const adminId=req.userId
  try {
    
    const getCategories = await databaseQuery(`SELECT * FROM category_tbl WHERE created_by=${adminId}`);

    res.json(responseObj("true", 200, "category data", getCategories));

  } catch (error) {
    console.log(error);
    res.json(responseObj("false", 500, "something went wrong"))
  }
}


