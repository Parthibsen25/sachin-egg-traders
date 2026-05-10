// Load prices from localStorage, optionally from a published Google Sheet (CSV), and update the price ticker
// To enable Google Sheets syncing: publish your sheet to the web (CSV) and set SHEET_CSV_URL to that URL.
// CSV export URL for your Google Sheet
// Make sure the sheet is shared as "Anyone with the link can view" or published to the web.
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1bJoZamIATsUmGQSF8ZRCt0GmMDV9Ygy4KOfuHb9qzJs/export?format=csv&gid=0';

function parseCsvToPrices(csvText) {
  const lines = csvText.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(r => r.split(',').map(c => c.trim()));
  const prices = { big: {}, medium: {}, small: {}, desi: {}, duck: {}, updateDate: '' };

  rows.forEach(cols => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] || '').trim());
    const type = (obj.type || '').toLowerCase();
    if (type && prices[type] !== undefined) {
      prices[type] = {
        price: obj.price || prices[type].price || '0'
      };
    }
    if (obj.updatedate || obj.update_date || obj.date) {
      prices.updateDate = obj.updatedate || obj.update_date || obj.date;
    }
  });
  return prices;
}

async function fetchSheetPrices() {
  if (!SHEET_CSV_URL) return null;
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();
    const parsed = parseCsvToPrices(text);
    return parsed;
  } catch (e) {
    console.warn('Failed to fetch sheet CSV', e);
    return null;
  }
}

async function loadPriceTicker() {
  // Try Google Sheet first (if configured)
  const sheetPrices = await fetchSheetPrices();
  let prices;
  if (sheetPrices) {
    prices = sheetPrices;
  } else {
    const stored = localStorage.getItem('eggPrices');
    if (stored) prices = JSON.parse(stored);
  }

  if (!prices) {
    // DEFAULT PRICES (1 Peti = 210 Pieces)
    prices = {
      big: { price: '1100' },
      medium: { price: '1000' },
      small: { price: '900' },
      desi: { price: '1200' },
      duck: { price: '1500' },
      updateDate: 'May 10, 2026'
    };
  }

  // Helper to update a type (only price)
  function applyType(type) {
    const priceEl = document.querySelector(`[data-price-type="${type}"] .price-value`);
    if (!prices[type]) return;
    if (priceEl) priceEl.textContent = '₹ ' + prices[type].price;
  }

  ['big','medium','small','desi','duck'].forEach(applyType);

  // UPDATE DATE
  const updateDateEl = document.querySelector('.ticker-update');
  if (updateDateEl) {
    updateDateEl.textContent = 'Last updated: ' + (prices.updateDate || 'Today') + ' • 1 Peti = 210 Pieces';
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadPriceTicker);

// Refresh prices every 30 seconds (in case admin updates them)
setInterval(loadPriceTicker, 30000);
