import express from "express";
import { tokenVerificationForAdmin } from "../../middlewares/token.verification.js";
import { responseObj } from "../../utils/responseObj.js";

let router = express();

router.get("/checkauth", tokenVerificationForAdmin, (req, res) => {
  try {
    // console.log("in checkauth");

    res.status(200).json(responseObj(true, 200, "admin already logged in"));
  } catch (error) {
    res
      .status(400)
      .json(responseObj(false, 400, "admin not already logged in"));
  }
});

export default router;
