const express = require('express');
const router = express.Router();
const Price = require('../models/Price');
const mongoose = require('mongoose');

async function ensureDb() {
  if (mongoose.connection.readyState === 1) return;
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('Missing MONGO_URI');
  await mongoose.connect(mongoUri);
}

// GET all prices (customers see this)
router.get('/', async (req, res) => {
  try {
    await ensureDb();
    const prices = await Price.find();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE price (only you/admin can do this)
router.put('/:eggType', async (req, res) => {
  const { password, pricePerEgg, pricePerTray } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password!' });
  }

  try {
    await ensureDb();
    const price = await Price.findOneAndUpdate(
      { eggType: req.params.eggType },
      { pricePerEgg, pricePerTray, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ message: 'Price updated!', price });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
