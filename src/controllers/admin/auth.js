const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already registed!",
      });

    const { firstName, lastName, email, fullName, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      fullName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
      role: "admin",
    });

    _user.save((err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (data) {
        return res.status(201).json({
          message: "Admin create successfully",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (err) return res.status(400).json({ err });
    if (user) {
      let checkPassword = await user.authenticate(req.body.password);
      if (checkPassword && user.role === "admin") {
        const { _id, firstName, lastName, email, role } = user;
        const token = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            role,
          },
        });
      } else {
        return res.status(400).json({
          message: "Invalid password ...",
        });
      }
    } else {
      return res.status(400).json({
        message: "Something went wrong ...",
      });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...! ",
  });
};
