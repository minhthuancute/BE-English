const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    token: String,
  },
  {
    timestamps: true,
    collection: "mt-tokens",
  }
);

TokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: process.env.TOKEN_EXPIRED }
);
module.exports = mongoose.model("Token", TokenSchema);
