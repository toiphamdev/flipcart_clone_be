const express = require("express");

const { addAddress, getAddress } = require("../controllers/address");
const { userMiddleWare, requireSigin } = require("../middlewares");

const router = express.Router();

router.post("/user/address/create", requireSigin, userMiddleWare, addAddress);

router.get(
  "/user/address/get-user-address",
  requireSigin,
  userMiddleWare,
  getAddress
);

module.exports = router;
