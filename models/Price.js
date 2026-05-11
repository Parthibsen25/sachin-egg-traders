const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  type: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  updateDate: { type: String }
});

module.exports = mongoose.model('Price', PriceSchema);
