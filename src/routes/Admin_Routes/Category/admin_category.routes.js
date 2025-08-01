import express from "express";
const router = express.Router();

import {
  categoryPage,
  List_All_Category,
  Add_Category,
  View_Single_Category,
  Fetch_EditCategory,
  EditCategory,
  DeleteCategory,
  searchCategories,
} from "../../../controllers/Admin Controller/Category/admin_category.controller.js";
import { tokenVerificationForAdmin } from "../../../middlewares/token.verification.js";

router.get("/", tokenVerificationForAdmin, categoryPage);
router.get("/list-all", tokenVerificationForAdmin, List_All_Category);
router.get('/search', tokenVerificationForAdmin, searchCategories);
router.post("/add", tokenVerificationForAdmin, Add_Category);
router.get("/view/:id", tokenVerificationForAdmin, View_Single_Category);
router.get("/update/:id", tokenVerificationForAdmin, Fetch_EditCategory);
router.put("/update/:id", tokenVerificationForAdmin, EditCategory);
router.delete("/delete/:id", DeleteCategory);

// router.get("/categoryPage/:next_page?", categoryListingFn)
// router.get("/applicant/view/:id", renderViewPage)
// router.get("/applicant/update/:id", renderUpdatePage)
// router.post("/applicant/update/:id", submitUpdateForm)

export default router;
