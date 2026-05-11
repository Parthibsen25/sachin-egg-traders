require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Price = require('./models/Price');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// mount prices router
app.use('/api/prices', require('./routes/prices'));

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in environment. Set in .env or as env var.');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

// Note: GET and PUT for /api/prices are handled by routes/prices.js

// POST /api/seed - populate defaults
app.post('/api/seed', async (req, res) => {
  // defaults based on per-peti prices (1 peti = 210 pieces, tray = 30)
  const base = [
    { eggType: 'big', peti: 1100 },
    { eggType: 'medium', peti: 1000 },
    { eggType: 'small', peti: 900 },
    { eggType: 'desi', peti: 1200 },
    { eggType: 'duck', peti: 1500 }
  ];
  try {
    await Promise.all(base.map(d => {
      const pricePerEgg = Number((d.peti / 210).toFixed(2));
      const pricePerTray = Number((pricePerEgg * 30).toFixed(2));
      return Price.findOneAndUpdate({ eggType: d.eggType }, { eggType: d.eggType, pricePerEgg, pricePerTray, updatedAt: new Date() }, { upsert: true });
    }));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Seed failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
