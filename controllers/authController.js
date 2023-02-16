const catchAsync = require("../middlewares/catchAsync");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getProfile = catchAsync(async (req, res) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const token = headerToken.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findOne({
      email: user.email,
    }).select("-password -createdAt -updatedAt -__v");
    res.status(200).json({
      success: true,
      data: currentUser,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token is expried");
    }
    throw new ApiError(401, "Unauthorized");
  }
});

exports.updateProfile = catchAsync(async (req, res) => {
  const headerToken = req.headers.authorization;
  const { firstname, lastname, phone, address } = req.body;
  if (!headerToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const token = headerToken.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const updateUser = await User.findOneAndUpdate(
      {
        email: user.email,
      },
      {
        $set: {
          firstname,
          lastname,
          phone,
          address,
        },
      },
      {
        new: true,
      }
    ).select("-createdAt -updatedAt");

    res.status(200).json({
      success: true,
      data: updateUser,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token is expried");
    }
    throw new ApiError(401, "Unauthorized");
  }
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const existedEmail = await User.findOne({ email }).select(
    "-createdAt -updatedAt -__v"
  );
  if (!existedEmail) {
    throw new ApiError(400, "email or password is incorrect");
  }
  const isMatch = bcrypt.compareSync(password, existedEmail.password);
  if (!isMatch) {
    throw new ApiError(400, "email or password is incorrect");
  }

  const token = jwt.sign(
    {
      email: existedEmail.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TOKEN_EXPRIED,
    }
  );

  const refreshToken = await RefreshToken.createToken(existedEmail);
  res.status(200).json({
    success: true,
    data: {
      ...existedEmail["_doc"],
      refreshToken,
      token,
    },
  });
});

exports.register = catchAsync(async (req, res) => {
  const { email, password, firstname, lastname, avatar, phone, address } =
    req.body;

  const users = await User.find({});
  const existedEmail = users.some((val) => val.email === email);
  if (existedEmail) {
    throw new ApiError(400, "Email is existed!");
  }
  const customer = await stripe.customers.create({
    email,
  });
  console.log("customer.id", customer.id);
  const user = await User.create({
    email,
    password,
    firstname,
    lastname,
    customerID: customer.id,
    avatar,
    phone,
    address,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(400).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newToken = jwt.sign({ id: refreshToken.user._id }, "12345", {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token: newToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
});
