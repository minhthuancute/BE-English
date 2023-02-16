const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name's product is required"],
    },
    category: {
      type: String,
      required: [true, "Category's product is required"],
    },
    colors: {
      type: [String],
      required: [true, "Color's product is required"],
    },
    description: {
      type: String,
      required: [true, "Description's product is required"],
    },
    // array img
    imgs: [
      {
        type: String,
        required: [true, "Image's product is required"],
      },
    ],
    price: {
      type: Number,
      required: [true, "Price's product is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating's product is required"],
    },
    size: {
      type: [Number],
      required: [true, "Size's product is required"],
    },
    type: {
      type: String,
      required: [true, "Type's product is required"],
    },
    badge: {
      type: String,
      required: [true, "Badge's product is required"],
    },
    userLiked: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    collection: "mt-products",
    versionKey: false,
  }
);

module.exports = mongoose.model("products", ProductSchema);
