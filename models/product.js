const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name: { type: String, required: true, maxLength: 36 },
  description: { type: String, required: true, maxLength: 180 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
});

ProductSchema.virtual("url").get(function () {
  return `/catalog/product/${this._id}`;
});

module.exports = mongoose.model("Products", ProductSchema);
