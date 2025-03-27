const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require("../errors/index");

const { JWT_SECRET } = require("../utils/config");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("The password and email fields are required"));
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email and password"));
    });
};

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ username, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Email already in use"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(new InternalServerError("Server error occurred"));
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .populate("savedArticles")
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
};
