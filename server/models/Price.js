const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  eggType: { type: String, required: true, unique: true },
  pricePerEgg: { type: Number, required: true },
  pricePerTray: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Price', priceSchema);
