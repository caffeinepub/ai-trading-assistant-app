import { Position } from '../backend';
import { getSimulatedPrice, getSimulatedRSI, getSentiment, OVERNIGHT_MOVES } from './mockMarketData';

export type AssistantMode = 'strategist' | 'guard' | 'hunter';

export interface TradeSetup {
  ticker: string;
  pattern?: string;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: string;
  rationale: string;
  timeframe?: string;
}

export interface AssistantResponse {
  text: string;
  tradeSetups?: TradeSetup[];
  correlationRisk?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

const BREAKOUT_SETUPS: TradeSetup[] = [
  {
    ticker: 'NVDA',
    pattern: 'Bull Flag',
    entry: 878.50,
    stopLoss: 855.00,
    takeProfit: 935.00,
    riskReward: '2.4:1',
    rationale: 'Consolidating after strong earnings momentum. Volume declining on pullback — classic bull flag. AI infrastructure demand remains a structural tailwind.',
    timeframe: '4H'
  },
  {
    ticker: 'AAPL',
    pattern: 'Double Bottom',
    entry: 191.20,
    stopLoss: 184.50,
    takeProfit: 208.00,
    riskReward: '2.5:1',
    rationale: 'Two equal lows at $184 support zone with increasing volume on second bounce. Services revenue growth provides fundamental backing.',
    timeframe: '1D'
  },
  {
    ticker: 'BTC',
    pattern: 'Ascending Triangle',
    entry: 68200,
    stopLoss: 65800,
    takeProfit: 74500,
    riskReward: '2.6:1',
    rationale: 'Flat resistance at $68K with higher lows forming. Institutional accumulation visible in on-chain data. ETF inflows remain positive.',
    timeframe: '4H'
  }
];

function extractTicker(query: string): string | null {
  const tickers = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META', 'AMD', 'NFLX', 'JPM', 'BTC', 'ETH', 'SOL', 'SPY', 'QQQ'];
  const upper = query.toUpperCase();
  return tickers.find((t) => upper.includes(t)) ?? null;
}

export function generateStrategistResponse(query: string): AssistantResponse {
  const ticker = extractTicker(query);
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('briefing') || lowerQuery.includes('morning') || lowerQuery.includes('market')) {
    const moves = OVERNIGHT_MOVES.slice(0, 3);
    const summary = moves.map((m) => `${m.market}: ${m.changePercent > 0 ? '+' : ''}${m.changePercent.toFixed(2)}%`).join(' | ');
    return {
      text: `**Morning Market Briefing**\n\nOvernight snapshot: ${summary}\n\nKey focus today: CPI data came in hotter than expected at 3.1% vs 2.8% forecast. This creates headwinds for rate-sensitive sectors. Tech remains resilient on AI demand narrative. Recommend reducing exposure to long-duration bonds and monitoring SPY 510 support level.\n\nSentiment: Cautiously Bullish with elevated macro risk.`,
      riskLevel: 'medium'
    };
  }

  if (ticker) {
    const price = getSimulatedPrice(ticker);
    const rsi = getSimulatedRSI(ticker);
    const sentiment = getSentiment(ticker);
    const entry = price;
    const stopLoss = parseFloat((price * 0.965).toFixed(2));
    const takeProfit = parseFloat((price * 1.085).toFixed(2));
    const rr = (((takeProfit - entry) / (entry - stopLoss))).toFixed(1);

    return {
      text: `**${ticker} Trade Analysis**\n\nCurrent Price: $${price.toFixed(2)} | RSI: ${rsi.toFixed(1)} | Sentiment: ${sentiment}\n\n${rsi > 70 ? '⚠️ RSI overbought — consider waiting for pullback before entry.' : rsi < 30 ? '✅ RSI oversold — potential reversal setup.' : 'RSI in neutral zone — momentum is balanced.'}\n\nRisk-managed setup below:`,
      tradeSetups: [{
        ticker,
        entry,
        stopLoss,
        takeProfit,
        riskReward: `${rr}:1`,
        rationale: `Based on current price action and ${sentiment.toLowerCase()} sentiment. Stop placed below recent support structure.`
      }],
      riskLevel: rsi > 70 ? 'high' : rsi < 30 ? 'low' : 'medium'
    };
  }

  return {
    text: `**Daily Strategist Analysis**\n\nMarkets are showing mixed signals today. The macro backdrop remains cautious with CPI above expectations. I recommend focusing on quality names with strong earnings momentum.\n\nAsk me about a specific ticker (e.g., "analyze NVDA") or request a "morning briefing" for a full market overview. I can provide Entry, Stop-Loss, and Take-Profit levels for any setup.`,
    riskLevel: 'medium'
  };
}

export function generateGuardResponse(query: string, positions: Position[]): AssistantResponse {
  const ticker = extractTicker(query);

  if (positions.length === 0) {
    return {
      text: `**Portfolio Risk Guard**\n\nNo active positions found in your portfolio. Add positions in the Portfolio section, then I can analyze correlation risk, sector concentration, and drawdown scenarios for any proposed trade.`,
      riskLevel: 'low'
    };
  }

  const tickers = positions.map((p) => p.ticker);
  const totalValue = positions.reduce((sum, p) => sum + p.entryPrice * p.quantity, 0);

  if (ticker) {
    const isCorrelated = tickers.some((t) => {
      const techTickers = ['AAPL', 'MSFT', 'NVDA', 'AMD', 'GOOGL', 'META', 'TSLA'];
      return techTickers.includes(t) && techTickers.includes(ticker);
    });

    const price = getSimulatedPrice(ticker);
    const positionSize = price * 100;
    const portfolioImpact = ((positionSize / (totalValue + positionSize)) * 100).toFixed(1);

    return {
      text: `**Correlation Risk Analysis: ${ticker}**\n\nExisting positions: ${tickers.join(', ')}\n\n${isCorrelated ? `⚠️ **High Correlation Risk**: ${ticker} is highly correlated with your existing tech holdings. Adding this position increases sector concentration risk.` : `✅ **Low Correlation**: ${ticker} shows low correlation with your current holdings — good diversification.`}\n\nPortfolio Impact: Adding 100 shares at $${price.toFixed(2)} would represent ~${portfolioImpact}% of total portfolio value.\n\n**Recommendation**: ${isCorrelated ? 'Consider reducing existing tech exposure before adding. Max position size: 5% of portfolio.' : 'Position size looks manageable. Ensure stop-loss is set to limit downside to 2% of total portfolio.'}`,
      correlationRisk: isCorrelated ? 'High — Tech sector concentration' : 'Low — Good diversification',
      riskLevel: isCorrelated ? 'high' : 'low'
    };
  }

  const nearStopLoss = positions.filter((p) => {
    if (p.stopLoss == null) return false;
    const current = getSimulatedPrice(p.ticker);
    const dist = ((current - p.stopLoss) / current) * 100;
    return dist <= 5 && dist >= 0;
  });

  return {
    text: `**Portfolio Health Report**\n\nActive Positions: ${positions.length} | Total Exposure: $${totalValue.toLocaleString()}\n\n${nearStopLoss.length > 0 ? `⚠️ **Stop-Loss Alert**: ${nearStopLoss.map((p) => p.ticker).join(', ')} are within 5% of their stop-loss levels. Consider tightening or exiting.` : '✅ All positions are safely above stop-loss levels.'}\n\nPropose a trade (e.g., "analyze adding TSLA") and I'll check it against your portfolio for correlation and concentration risk.`,
    riskLevel: nearStopLoss.length > 0 ? 'high' : 'low'
  };
}

export function generateHunterResponse(query: string): AssistantResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('backtest') || lowerQuery.includes('win rate')) {
    const ticker = extractTicker(query) ?? 'SPY';
    const winRate = (55 + Math.random() * 20).toFixed(1);
    return {
      text: `**Backtest Results: ${ticker}**\n\nStrategy: Bull Flag / Breakout Pattern\nPeriod: Last 12 months\nWin Rate: **${winRate}%**\nAvg Win: +8.4% | Avg Loss: -3.2%\nProfit Factor: 2.1\nMax Drawdown: -12.3%\n\nNote: Past performance does not guarantee future results. Always use proper position sizing and stop-losses.`,
      riskLevel: 'medium'
    };
  }

  return {
    text: `**Alpha Hunter — Top 3 Breakout Setups**\n\nScanned Nasdaq-100 for unusual options activity and technical patterns. Here are today's highest-probability setups:`,
    tradeSetups: BREAKOUT_SETUPS,
    riskLevel: 'medium'
  };
}

export function generateResponse(mode: AssistantMode, query: string, positions: Position[]): AssistantResponse {
  switch (mode) {
    case 'strategist':
      return generateStrategistResponse(query);
    case 'guard':
      return generateGuardResponse(query, positions);
    case 'hunter':
      return generateHunterResponse(query);
  }
}
