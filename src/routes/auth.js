const express = require("express");
const { signup, signin } = require("../controllers/auth");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSigninRequest,
} = require("../validator/auth");

const router = express.Router();

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/signup", validateSignupRequest, isRequestValidated, signup);

// router.post("/profile", requireSigin, (req, res) => {
//   res.status(200).json({
//     user: "profile",
//   });
// });

module.exports = router;
