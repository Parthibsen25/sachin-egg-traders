// Load prices from localStorage and update the price ticker
function loadPriceTicker() {
  const stored = localStorage.getItem('eggPrices');
  let prices;

  if (stored) {
    prices = JSON.parse(stored);
  } else {
    // DEFAULT PRICES (1 Peti = 210 Pieces)
    prices = {
      big: { price: '1100', trend: 'stable', trendText: 'Stable' },
      medium: { price: '1000', trend: 'stable', trendText: 'Stable' },
      small: { price: '900', trend: 'stable', trendText: 'Stable' },
      desi: { price: '1200', trend: 'stable', trendText: 'Stable' },
      duck: { price: '1500', trend: 'stable', trendText: 'Stable' },
      updateDate: 'May 10, 2026'
    };
  }

  // UPDATE BIG EGGS
  const bigPriceEl = document.querySelector('[data-price-type="big"] .price-value');
  const bigTrendEl = document.querySelector('[data-price-type="big"] .price-trend');
  if (bigPriceEl) bigPriceEl.textContent = '₹ ' + prices.big.price;
  if (bigTrendEl) {
    const trendClass = 'trend-' + prices.big.trend;
    bigTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.big.trend === 'up' ? '↑' : prices.big.trend === 'down' ? '↓' : '→';
    bigTrendEl.textContent = symbol + ' ' + prices.big.trendText;
  }

  // UPDATE MEDIUM EGGS
  const mediumPriceEl = document.querySelector('[data-price-type="medium"] .price-value');
  const mediumTrendEl = document.querySelector('[data-price-type="medium"] .price-trend');
  if (mediumPriceEl) mediumPriceEl.textContent = '₹ ' + prices.medium.price;
  if (mediumTrendEl) {
    const trendClass = 'trend-' + prices.medium.trend;
    mediumTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.medium.trend === 'up' ? '↑' : prices.medium.trend === 'down' ? '↓' : '→';
    mediumTrendEl.textContent = symbol + ' ' + prices.medium.trendText;
  }

  // UPDATE SMALL EGGS
  const smallPriceEl = document.querySelector('[data-price-type="small"] .price-value');
  const smallTrendEl = document.querySelector('[data-price-type="small"] .price-trend');
  if (smallPriceEl) smallPriceEl.textContent = '₹ ' + prices.small.price;
  if (smallTrendEl) {
    const trendClass = 'trend-' + prices.small.trend;
    smallTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.small.trend === 'up' ? '↑' : prices.small.trend === 'down' ? '↓' : '→';
    smallTrendEl.textContent = symbol + ' ' + prices.small.trendText;
  }

  // UPDATE DESI EGGS
  const desiPriceEl = document.querySelector('[data-price-type="desi"] .price-value');
  const desiTrendEl = document.querySelector('[data-price-type="desi"] .price-trend');
  if (desiPriceEl) desiPriceEl.textContent = '₹ ' + prices.desi.price;
  if (desiTrendEl) {
    const trendClass = 'trend-' + prices.desi.trend;
    desiTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.desi.trend === 'up' ? '↑' : prices.desi.trend === 'down' ? '↓' : '→';
    desiTrendEl.textContent = symbol + ' ' + prices.desi.trendText;
  }

  // UPDATE DUCK EGGS
  const duckPriceEl = document.querySelector('[data-price-type="duck"] .price-value');
  const duckTrendEl = document.querySelector('[data-price-type="duck"] .price-trend');
  if (duckPriceEl) duckPriceEl.textContent = '₹ ' + prices.duck.price;
  if (duckTrendEl) {
    const trendClass = 'trend-' + prices.duck.trend;
    duckTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.duck.trend === 'up' ? '↑' : prices.duck.trend === 'down' ? '↓' : '→';
    duckTrendEl.textContent = symbol + ' ' + prices.duck.trendText;
  }

  // UPDATE DATE
  const updateDateEl = document.querySelector('.ticker-update');
  if (updateDateEl) {
    updateDateEl.textContent = 'Last updated: ' + prices.updateDate + ' • 1 Peti = 210 Pieces';
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadPriceTicker);

// Refresh prices every 30 seconds (in case admin updates them)
setInterval(loadPriceTicker, 30000);
