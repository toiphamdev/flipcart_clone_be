const express = require("express");

const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
} = require("../controllers/category");
const { requireSigin, adminMiddleWare, upload } = require("../middlewares");

const router = express.Router();

router.post(
  "/category/create",
  requireSigin,
  adminMiddleWare,
  upload.single("categoryImage"),
  addCategory
);
router.get("/category/get-categories", getCategories);
router.post(
  "/category/update",
  requireSigin,
  adminMiddleWare,
  upload.single("categoryImage"),
  updateCategories
);
router.post("/category/delete", deleteCategories);

module.exports = router;
