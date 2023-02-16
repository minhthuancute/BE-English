const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstname: {
      type: String,
      required: [true, "Fullname is required"],
      minlength: 2,
    },
    lastname: {
      type: String,
      required: [true, "Fullname is required"],
      minlength: 2,
    },
    customerID: {
      type: String,
      required: [true, "Customer ID is required"],
    },
    avatar: {
      type: String,
      required: [true, "Avatar is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
  },
  {
    timestamps: true,
    collection: "mt-users",
    versionKey: false,
  }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
