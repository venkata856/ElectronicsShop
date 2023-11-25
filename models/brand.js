const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 72 },
  ceo_name: { type: String, required: true, maxLength: 36 },
  started: { type: Date, default: Date.now },
});

BrandSchema.virtual("url").get(function () {
  return `/catalog/brand/${this._id}`;
});
BrandSchema.virtual("startedDate").get(function () {
  return DateTime.fromJSDate(this.started).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("Brand", BrandSchema);
