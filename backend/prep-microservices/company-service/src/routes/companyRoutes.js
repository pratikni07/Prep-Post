const express = require("express");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getCompanies).post(protect, admin, createCompany);

router
  .route("/:id")
  .get(getCompany)
  .put(protect, admin, updateCompany)
  .delete(protect, admin, deleteCompany);

module.exports = router;
