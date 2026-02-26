import { Position } from '../backend';
import { getSimulatedPrice, getSectorDrawdown, SECTORS } from './mockMarketData';

export interface PositionWithMetrics extends Position {
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLossDistance: number | null;
  isNearStopLoss: boolean;
  marketValue: number;
}

export interface PortfolioMetrics {
  healthScore: number;
  totalDelta: number;
  totalPnL: number;
  totalPnLPercent: number;
  totalValue: number;
  positionCount: number;
}

export interface SectorDrawdownAlert {
  sector: string;
  drawdown: number;
}

export function enrichPositions(positions: Position[]): PositionWithMetrics[] {
  return positions.map((pos) => {
    const currentPrice = getSimulatedPrice(pos.ticker);
    const pnl = (currentPrice - pos.entryPrice) * pos.quantity;
    const pnlPercent = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
    const marketValue = currentPrice * pos.quantity;

    let stopLossDistance: number | null = null;
    let isNearStopLoss = false;

    if (pos.stopLoss != null) {
      stopLossDistance = ((currentPrice - pos.stopLoss) / currentPrice) * 100;
      isNearStopLoss = stopLossDistance <= 5 && stopLossDistance >= 0;
    }

    return {
      ...pos,
      currentPrice,
      pnl,
      pnlPercent,
      stopLossDistance,
      isNearStopLoss,
      marketValue
    };
  });
}

export function calculatePortfolioMetrics(enriched: PositionWithMetrics[]): PortfolioMetrics {
  if (enriched.length === 0) {
    return {
      healthScore: 100,
      totalDelta: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      totalValue: 0,
      positionCount: 0
    };
  }

  const totalValue = enriched.reduce((sum, p) => sum + p.marketValue, 0);
  const totalCost = enriched.reduce((sum, p) => sum + p.entryPrice * p.quantity, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // Health score: penalize for positions near stop-loss, high concentration, negative P&L
  let healthScore = 100;
  const nearStopLossCount = enriched.filter((p) => p.isNearStopLoss).length;
  healthScore -= nearStopLossCount * 15;

  const negativePositions = enriched.filter((p) => p.pnlPercent < -5).length;
  healthScore -= negativePositions * 10;

  if (totalPnLPercent < -10) healthScore -= 20;
  else if (totalPnLPercent < -5) healthScore -= 10;

  healthScore = Math.max(0, Math.min(100, healthScore));

  // Delta: sum of (quantity * currentPrice) weighted direction
  const totalDelta = enriched.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0);

  return {
    healthScore,
    totalDelta,
    totalPnL,
    totalPnLPercent,
    totalValue,
    positionCount: enriched.length
  };
}

export function getSectorDrawdownAlerts(): SectorDrawdownAlert[] {
  return SECTORS.map((sector) => ({
    sector,
    drawdown: getSectorDrawdown(sector)
  })).filter((s) => s.drawdown >= 10);
}
