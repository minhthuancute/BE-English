const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SizeSchema = new Schema(
  {
    sizeName: {
      type: Number,
      required: [true, "Size name is required"],
      unique: true,
      index: true,
    },
  },
  {
    collection: "mt-sizes",
    versionKey: false,
  }
);

module.exports = mongoose.model("Sizes", SizeSchema);
