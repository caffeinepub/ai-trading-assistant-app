// Simulated market data - no external API calls

export interface MarketAsset {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  rsi: number;
  trend: 'up' | 'down' | 'neutral';
  sentiment: 'Bullish' | 'Neutral' | 'Bearish';
  volume: string;
  sector: string;
}

export interface MacroEvent {
  id: string;
  name: string;
  date: string;
  expected: string;
  actual: string | null;
  deviation: number | null;
  status: 'upcoming' | 'released' | 'alert';
}

export interface OvernightMove {
  market: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  description: string;
}

// Seeded pseudo-random for consistent values per session
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getPrice(ticker: string, base: number): number {
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const variation = (seededRandom(seed + Date.now() / 86400000) - 0.5) * base * 0.04;
  return parseFloat((base + variation).toFixed(2));
}

function getRSI(ticker: string): number {
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = seededRandom(seed + Math.floor(Date.now() / 3600000)) * 100;
  return parseFloat(base.toFixed(1));
}

const BASE_PRICES: Record<string, number> = {
  'SPY': 512.40,
  'QQQ': 438.20,
  'AAPL': 189.50,
  'MSFT': 415.30,
  'NVDA': 875.60,
  'TSLA': 248.90,
  'AMZN': 185.40,
  'GOOGL': 172.80,
  'META': 512.70,
  'BTC': 67420.00,
  'ETH': 3580.00,
  'SOL': 148.20,
  'GLD': 218.40,
  'TLT': 92.30,
  'VIX': 14.80,
  'AMD': 168.40,
  'NFLX': 628.90,
  'JPM': 198.70,
};

export function getSimulatedPrice(ticker: string): number {
  const base = BASE_PRICES[ticker.toUpperCase()] ?? 100;
  return getPrice(ticker.toUpperCase(), base);
}

export function getSimulatedRSI(ticker: string): number {
  return getRSI(ticker.toUpperCase());
}

export function getSimulatedChange(ticker: string): { change: number; changePercent: number } {
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pct = (seededRandom(seed + Math.floor(Date.now() / 86400000)) - 0.48) * 4;
  const price = getSimulatedPrice(ticker);
  const change = parseFloat((price * pct / 100).toFixed(2));
  return { change, changePercent: parseFloat(pct.toFixed(2)) };
}

export function getSentiment(ticker: string): 'Bullish' | 'Neutral' | 'Bearish' {
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const val = seededRandom(seed + Math.floor(Date.now() / 86400000));
  if (val > 0.6) return 'Bullish';
  if (val < 0.3) return 'Bearish';
  return 'Neutral';
}

export function getTrend(ticker: string): 'up' | 'down' | 'neutral' {
  const { changePercent } = getSimulatedChange(ticker);
  if (changePercent > 0.3) return 'up';
  if (changePercent < -0.3) return 'down';
  return 'neutral';
}

export function getSectorDrawdown(sector: string): number {
  const seed = sector.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const val = seededRandom(seed + Math.floor(Date.now() / 86400000));
  // Occasionally trigger >10% drawdown for demo
  if (val > 0.75) return parseFloat((10 + val * 8).toFixed(1));
  return parseFloat((val * 9).toFixed(1));
}

export const OVERNIGHT_MOVES: OvernightMove[] = [
  {
    market: 'S&P 500',
    ticker: 'SPY',
    price: getSimulatedPrice('SPY'),
    change: getSimulatedChange('SPY').change,
    changePercent: getSimulatedChange('SPY').changePercent,
    description: 'US large-cap equities index tracking 500 leading companies'
  },
  {
    market: 'Nasdaq-100',
    ticker: 'QQQ',
    price: getSimulatedPrice('QQQ'),
    change: getSimulatedChange('QQQ').change,
    changePercent: getSimulatedChange('QQQ').changePercent,
    description: 'Tech-heavy index featuring top 100 non-financial Nasdaq companies'
  },
  {
    market: 'Bitcoin',
    ticker: 'BTC',
    price: getSimulatedPrice('BTC'),
    change: getSimulatedChange('BTC').change,
    changePercent: getSimulatedChange('BTC').changePercent,
    description: 'Leading cryptocurrency by market capitalization'
  },
  {
    market: 'Gold',
    ticker: 'GLD',
    price: getSimulatedPrice('GLD'),
    change: getSimulatedChange('GLD').change,
    changePercent: getSimulatedChange('GLD').changePercent,
    description: 'Safe-haven commodity and inflation hedge'
  },
  {
    market: 'Volatility Index',
    ticker: 'VIX',
    price: getSimulatedPrice('VIX'),
    change: getSimulatedChange('VIX').change,
    changePercent: getSimulatedChange('VIX').changePercent,
    description: "Market's expectation of near-term volatility"
  }
];

export const MACRO_EVENTS: MacroEvent[] = [
  {
    id: '1',
    name: 'CPI (YoY)',
    date: 'Feb 28, 2026',
    expected: '2.8%',
    actual: '3.1%',
    deviation: 10.7,
    status: 'alert'
  },
  {
    id: '2',
    name: 'Fed Interest Rate Decision',
    date: 'Mar 5, 2026',
    expected: '4.25%',
    actual: null,
    deviation: null,
    status: 'upcoming'
  },
  {
    id: '3',
    name: 'Non-Farm Payrolls',
    date: 'Mar 7, 2026',
    expected: '185K',
    actual: null,
    deviation: null,
    status: 'upcoming'
  },
  {
    id: '4',
    name: 'GDP Growth Rate (Q4)',
    date: 'Feb 27, 2026',
    expected: '2.3%',
    actual: '2.4%',
    deviation: 4.3,
    status: 'released'
  },
  {
    id: '5',
    name: 'NVDA Earnings',
    date: 'Mar 12, 2026',
    expected: '$0.89 EPS',
    actual: null,
    deviation: null,
    status: 'upcoming'
  },
  {
    id: '6',
    name: 'PCE Price Index',
    date: 'Mar 14, 2026',
    expected: '2.5%',
    actual: null,
    deviation: null,
    status: 'upcoming'
  }
];

export const DEFAULT_BRIEFING = `**Daily Market Briefing — ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}**

Overnight session showed mixed signals across major indices. The S&P 500 futures traded cautiously ahead of key macro data, while tech stocks showed resilience led by semiconductor names. Bitcoin consolidated near recent highs as institutional demand remains steady.

**Key Themes:**
• Fed officials reiterated data-dependent stance; markets pricing in 2 cuts for 2026
• CPI print came in hotter than expected at 3.1% vs 2.8% forecast — watch for rate sensitivity
• NVDA earnings approaching — options market pricing in ±8% move
• Dollar strength weighing on emerging market assets and commodities

**Risk Factors:** Elevated VIX suggests hedging activity. Monitor 10Y Treasury yield for equity correlation signals.`;

export const SECTORS = ['Technology', 'Healthcare', 'Financials', 'Energy', 'Consumer'];
