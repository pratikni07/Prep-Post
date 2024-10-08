const express = require("express");
const { search, indexData } = require("../controllers/searchController");

const router = express.Router();

router.get("/", search);
router.post("/index", indexData);

module.exports = router;
