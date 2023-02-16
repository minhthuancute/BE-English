const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    colorName: {
      type: String,
      required: [true, "Color name is required"],
      unique: true,
      index: true,
    },
  },
  {
    collection: "mt-colors",
    versionKey: false,
  }
);

module.exports = mongoose.model("Colors", ColorSchema);
