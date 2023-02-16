const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      index: true,
    },
  },
  {
    collection: "mt-categories",
    versionKey: false,
  }
);

module.exports = mongoose.model("Categories", CategorySchema);
