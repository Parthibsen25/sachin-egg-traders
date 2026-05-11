const express = require('express');
const router = express.Router();
const Price = require('../models/Price');

// GET all prices (customers see this)
router.get('/', async (req, res) => {
  try {
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
