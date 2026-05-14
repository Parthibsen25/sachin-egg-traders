const path = require('path');

// Only load .env in local development; Vercel injects env vars directly
const fs = require('fs');
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Price = require('./models/Price');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/prices', require('./routes/prices'));

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
console.log('Environment check: MONGO_URI exists?', !!process.env.MONGO_URI);
console.log('Environment check: MONGODB_URI exists?', !!process.env.MONGODB_URI);
if (!mongoUri) {
  console.error('Missing MONGO_URI or MONGODB_URI in environment.');
  // In local development we should fail fast. In serverless (Vercel) return and let logs surface.
  if (!process.env.VERCEL) process.exit(1);
}

async function seedDefaultsIfEmpty() {
  const count = await Price.countDocuments();
  if (count !== 0) return;

  await Price.insertMany([
    { eggType: 'White', pricePerEgg: 6.50, pricePerTray: 195 },
    { eggType: 'Desi', pricePerEgg: 8.00, pricePerTray: 240 },
    { eggType: 'Brown', pricePerEgg: 7.50, pricePerTray: 225 },
  ]);
  console.log('Default prices added ✅');
}

const port = process.env.PORT || 4000;
mongoose.connect(mongoUri)
  .then(async () => {
    console.log('MongoDB connected ✅');
    await seedDefaultsIfEmpty();

    // On Vercel (serverless) we should NOT call app.listen(); instead export the app.
    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`Server running on port ${port} ✅`);
      });
    } else {
      console.log('Running on Vercel serverless - exporting app');
    }
  })
  .catch(err => {
    console.error('Error:', err);
    if (!process.env.VERCEL) process.exit(1);
  });

module.exports = app;
