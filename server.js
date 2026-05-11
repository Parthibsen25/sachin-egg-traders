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
    if (Array.isArray(body)) {
      await Promise.all(body.map(p => Price.findOneAndUpdate(
        { type: p.type }, { price: p.price, updateDate: p.updateDate || new Date().toLocaleDateString() }, { upsert: true }
      )));
    } else {
      const p = body;
      await Price.findOneAndUpdate({ type: p.type }, { price: p.price, updateDate: p.updateDate || new Date().toLocaleDateString() }, { upsert: true });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save prices' });
  }
});

// POST /api/seed - populate defaults
app.post('/api/seed', async (req, res) => {
  const defaults = [
    { type: 'big', price: 1100, updateDate: 'May 11, 2026' },
    { type: 'medium', price: 1000, updateDate: 'May 11, 2026' },
    { type: 'small', price: 900, updateDate: 'May 11, 2026' },
    { type: 'desi', price: 1200, updateDate: 'May 11, 2026' },
    { type: 'duck', price: 1500, updateDate: 'May 11, 2026' }
  ];
  try {
    await Promise.all(defaults.map(d => Price.findOneAndUpdate({ type: d.type }, d, { upsert: true })));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Seed failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
