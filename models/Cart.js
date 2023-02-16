const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name's product is required"],
    },
    imageLink: {
      type: String,
      required: [true, "Image's product is required"],
    },
    price: {
      type: Number,
      required: [true, "Price's product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity's product is required"],
    },
  },
  {
    collection: "mt-carts",
    versionKey: false,
  }
);

module.exports = mongoose.model("Carts", CartSchema);
