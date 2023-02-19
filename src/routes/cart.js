const express = require("express");
const {
  addItemToCart,
  getCartItems,
  removeCartItem,
} = require("../controllers/cart");

const { requireSigin, userMiddleWare } = require("../middlewares");

const router = express.Router();

router.post(
  "/user/cart/add-to-cart",
  requireSigin,
  userMiddleWare,
  addItemToCart
);

router.post(
  "/user/cart/remove-cart-item",
  requireSigin,
  userMiddleWare,
  removeCartItem
);

router.get(
  "/user/cart/get-cart-items",
  requireSigin,
  userMiddleWare,
  getCartItems
);

module.exports = router;
