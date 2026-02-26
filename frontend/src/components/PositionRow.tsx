import { Position } from '../backend';
import { PositionWithMetrics } from '@/utils/portfolioCalculations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PositionRowProps {
  position: PositionWithMetrics;
  onRemove: (ticker: string) => void;
  isRemoving: boolean;
}

export function PositionRow({ position, onRemove, isRemoving }: PositionRowProps) {
  const isPnLPositive = position.pnl >= 0;

  return (
    <tr className={cn(
      'border-b border-border hover:bg-accent/20 transition-colors',
      position.isNearStopLoss && 'bg-warning/5'
    )}>
      {/* Ticker */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-foreground">{position.ticker}</span>
          {position.isNearStopLoss && (
            <Badge className="text-xs font-mono bg-warning/10 text-warning border border-warning/30 gap-1">
              <AlertTriangle size={9} />
              NEAR SL
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {position.quantity} shares
        </div>
      </td>

      {/* Entry Price */}
      <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
        ${position.entryPrice.toFixed(2)}
      </td>

      {/* Current Price */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {isPnLPositive ? <TrendingUp size={12} className="text-gain" /> : <TrendingDown size={12} className="text-loss" />}
          <span className="font-mono text-sm text-foreground font-semibold">
            ${position.currentPrice.toFixed(2)}
          </span>
        </div>
      </td>

      {/* P&L */}
      <td className="px-4 py-3">
        <div className={cn('font-mono text-sm font-semibold', isPnLPositive ? 'text-gain' : 'text-loss')}>
          {isPnLPositive ? '+' : ''}${Math.abs(position.pnl).toFixed(2)}
        </div>
        <div className={cn('text-xs font-mono', isPnLPositive ? 'text-gain' : 'text-loss')}>
          {isPnLPositive ? '+' : ''}{position.pnlPercent.toFixed(2)}%
        </div>
      </td>

      {/* Stop Loss */}
      <td className="px-4 py-3">
        {position.stopLoss != null ? (
          <div>
            <div className="font-mono text-sm text-muted-foreground">${position.stopLoss.toFixed(2)}</div>
            {position.stopLossDistance != null && (
              <div className={cn(
                'text-xs font-mono',
                position.isNearStopLoss ? 'text-warning' : 'text-muted-foreground'
              )}>
                {position.stopLossDistance.toFixed(1)}% away
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">—</span>
        )}
      </td>

      {/* Take Profit */}
      <td className="px-4 py-3">
        {position.takeProfit != null ? (
          <div className="font-mono text-sm text-gain">${position.takeProfit.toFixed(2)}</div>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-loss hover:bg-loss/10"
          onClick={() => onRemove(position.ticker)}
          disabled={isRemoving}
        >
          <Trash2 size={14} />
        </Button>
      </td>
    </tr>
  );
}
