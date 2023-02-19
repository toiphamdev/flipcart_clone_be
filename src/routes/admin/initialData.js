const express = require("express");
const { initialData } = require("../../controllers/admin/initialData");
const { adminMiddleWare, requireSigin } = require("../../middlewares");

const router = express.Router();

router.get("/initialdata", requireSigin, adminMiddleWare, initialData);

module.exports = router;
