const express = require("express");
const {
  updateOrder,
  getCustomerOrders,
} = require("../../controllers/admin/order.admin");
const { adminMiddleWare } = require("../../middlewares");

const { requireSigin } = require("../../middlewares");

const router = express.Router();

router.post("/order/update", requireSigin, adminMiddleWare, updateOrder);
router.get(
  "/order/get-customer-orders",
  requireSigin,
  adminMiddleWare,
  getCustomerOrders
);

module.exports = router;
