const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

const createJWT = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (err, user) => {
    if (user)
      return res.status(400).json({
        message: "User already registed!",
      });

    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });

    _user.save((err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
      if (data) {
        // return res.status(201).json({
        //   message: "User create successfully",
        // });
        const { _id, firstName, lastName, email, fullName, role } = data;
        const token = createJWT({ _id, role });

        res.status(201).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            fullName,
            email,
            role,
          },
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
      if (checkPassword && user.role === "user") {
        const { _id, firstName, lastName, email, fullName, role } = user;
        const token = createJWT({ _id, role });

        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            fullName,
            email,
            role,
          },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong ...",
        });
      }
    } else {
      return res.status(400).json({
        message: "Something went wrong ...",
      });
    }
  });
};
