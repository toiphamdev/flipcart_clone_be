const express = require("express");

const {
  addProduct,
  getProductBySlug,
  getProductDetailsById,
  deleteProductById,
  getHomeProducts,
} = require("../controllers/product");
const { requireSigin, adminMiddleWare, upload } = require("../middlewares");

const router = express.Router();

router.post(
  "/product/create",
  requireSigin,
  adminMiddleWare,
  upload.array("productPicture"),
  addProduct
);

router.get("/get-home-products", getHomeProducts);
router.get("/products/:slug", getProductBySlug);
router.get("/product/:productId", getProductDetailsById);
router.post(
  "/product/delete-product-by-id",
  requireSigin,
  adminMiddleWare,
  deleteProductById
);

module.exports = router;
