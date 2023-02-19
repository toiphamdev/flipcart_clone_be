const express = require("express");
const { addOrder, getOrder, getOrders } = require("../controllers/order");

const { requireSigin, userMiddleWare } = require("../middlewares");

const router = express.Router();

router.post("/user/order/add-order", requireSigin, userMiddleWare, addOrder);
router.get(
  "/user/order/get-order/:orderId",
  requireSigin,
  userMiddleWare,
  getOrder
);

router.get("/user/order/get-orders", requireSigin, userMiddleWare, getOrders);

module.exports = router;
