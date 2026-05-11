require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Price = require('./models/Price');

const app = express();
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in environment. Set in .env or as env var.');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

// GET /api/prices - return all prices
app.get('/api/prices', async (req, res) => {
  try {
    const docs = await Price.find({}, { _id: 0, __v: 0 }).lean();
    res.json(docs);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// POST /api/prices - upsert one or many prices (body: object or array)
app.post('/api/prices', async (req, res) => {
  try {
    const body = req.body;
    // normalize input to support legacy format ({type,price}) and new format ({eggType,pricePerEgg,pricePerTray})
    const upsertOne = async (p) => {
      const eggType = p.eggType || p.type;
      // pricePerEgg priority: explicit -> legacy per-peti price divided by 210
      let pricePerEgg = (p.pricePerEgg !== undefined) ? Number(p.pricePerEgg) : (p.price !== undefined ? Number(p.price) / 210 : undefined);
      let pricePerTray = (p.pricePerTray !== undefined) ? Number(p.pricePerTray) : (pricePerEgg ? Number((pricePerEgg * 30).toFixed(2)) : undefined);
      if (!eggType || pricePerEgg === undefined || pricePerTray === undefined) return;
      const updatedAt = p.updatedAt ? new Date(p.updatedAt) : new Date();
      await Price.findOneAndUpdate(
        { eggType },
        { eggType, pricePerEgg, pricePerTray, updatedAt },
        { upsert: true }
      );
    };

    if (Array.isArray(body)) {
      await Promise.all(body.map(p => upsertOne(p)));
    } else {
      await upsertOne(body);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save prices' });
  }
});

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
