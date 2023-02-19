const express = require("express");
const { createPage, getPage } = require("../../controllers/admin/page");
const { requireSigin, adminMiddleWare, upload } = require("../../middlewares");

const router = express.Router();

router.post(
  "/page/create",
  requireSigin,
  adminMiddleWare,
  upload.fields([{ name: "banners" }, { name: "products" }]),
  createPage
);

router.get("/page/:category/:type", getPage);

module.exports = router;
