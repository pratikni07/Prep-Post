const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
} = require("../utils/validation");

const router = express.Router();

router.post("/register", validateRegistration, userController.register);
router.post("/login", validateLogin, userController.login);
router.get("/profile", auth, userController.getProfile);
router.patch(
  "/profile",
  auth,
  validateProfileUpdate,
  userController.updateProfile
);
router.delete("/profile", auth, userController.deleteUser);
router.get("/:id/validate", auth, userController.validateUser);

module.exports = router;
