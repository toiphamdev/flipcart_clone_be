const jwt = require("jsonwebtoken");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
exports.requireSigin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({
      message: "Authorization is required",
    });
  }
  next();
};

exports.userMiddleWare = (req, res, next) => {
  if (req.user.role !== "user") {
    res.status(400).json({
      message: "User access denied",
    });
  }
  next();
};

exports.adminMiddleWare = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(400).json({
      message: "Admin access denied",
    });
  }
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});
exports.upload = multer({ storage });
