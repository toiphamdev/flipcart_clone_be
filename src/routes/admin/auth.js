const express = require("express");

const { signup, signin, signout } = require("../../controllers/admin/auth");
const { requireSigin } = require("../../middlewares");
const {
  isRequestValidated,
  validateSignupRequest,
  validateSigninRequest,
} = require("../../validator/auth");

const router = express.Router();

router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/admin/signout", signout);

module.exports = router;
