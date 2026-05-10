// Load prices from localStorage and update the price ticker
function loadPriceTicker() {
  const stored = localStorage.getItem('eggPrices');
  let prices;

  if (stored) {
    prices = JSON.parse(stored);
  } else {
    // DEFAULT PRICES
    prices = {
      white: { price: '420', trend: 'up', trendText: '+₹5 per dozen' },
      brown: { price: '450', trend: 'stable', trendText: 'Stable' },
      desi: { price: '520', trend: 'down', trendText: '-₹3 per dozen' },
      updateDate: 'May 10, 2026'
    };
  }

  // UPDATE WHITE EGGS
  const whitePriceEl = document.querySelector('[data-price-type="white"] .price-value');
  const whiteTrendEl = document.querySelector('[data-price-type="white"] .price-trend');
  if (whitePriceEl) whitePriceEl.textContent = '₹ ' + prices.white.price;
  if (whiteTrendEl) {
    const trendClass = 'trend-' + prices.white.trend;
    whiteTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.white.trend === 'up' ? '↑' : prices.white.trend === 'down' ? '↓' : '→';
    whiteTrendEl.textContent = symbol + ' ' + prices.white.trendText;
  }

  // UPDATE BROWN EGGS
  const brownPriceEl = document.querySelector('[data-price-type="brown"] .price-value');
  const brownTrendEl = document.querySelector('[data-price-type="brown"] .price-trend');
  if (brownPriceEl) brownPriceEl.textContent = '₹ ' + prices.brown.price;
  if (brownTrendEl) {
    const trendClass = 'trend-' + prices.brown.trend;
    brownTrendEl.className = 'price-trend ' + trendClass;
    const symbol = prices.brown.trend === 'up' ? '↑' : prices.brown.trend === 'down' ? '↓' : '→';
    brownTrendEl.textContent = symbol + ' ' + prices.brown.trendText;
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

  // UPDATE DATE
  const updateDateEl = document.querySelector('.ticker-update');
  if (updateDateEl) {
    updateDateEl.textContent = 'Last updated: ' + prices.updateDate + ' • Call for bulk orders & custom pricing';
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', loadPriceTicker);

// Refresh prices every 30 seconds (in case admin updates them)
setInterval(loadPriceTicker, 30000);
