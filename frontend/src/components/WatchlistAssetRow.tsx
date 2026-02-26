import { Position } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Trash2, AlertTriangle } from 'lucide-react';
import { getSimulatedPrice, getSimulatedRSI, getSimulatedChange, getSentiment, getTrend } from '@/utils/mockMarketData';
import { cn } from '@/lib/utils';

interface WatchlistAssetRowProps {
  ticker: string;
  description: string;
  onRemove: (ticker: string) => void;
  isRemoving: boolean;
}

function SentimentBadge({ sentiment }: { sentiment: 'Bullish' | 'Neutral' | 'Bearish' }) {
  if (sentiment === 'Bullish') {
    return <Badge className="text-xs font-mono bg-gain/10 text-gain border border-gain/30">BULLISH</Badge>;
  }
  if (sentiment === 'Bearish') {
    return <Badge className="text-xs font-mono bg-loss/10 text-loss border border-loss/30">BEARISH</Badge>;
  }
  return <Badge className="text-xs font-mono bg-muted text-muted-foreground border border-border">NEUTRAL</Badge>;
}

function RSIBadge({ rsi }: { rsi: number }) {
  const isOverbought = rsi > 70;
  const isOversold = rsi < 30;
  return (
    <div className={cn(
      'flex items-center gap-1 px-2 py-0.5 rounded-sm border text-xs font-mono',
      isOverbought ? 'bg-warning/10 text-warning border-warning/30' :
      isOversold ? 'bg-loss/10 text-loss border-loss/30' :
      'bg-muted text-muted-foreground border-border'
    )}>
      {(isOverbought || isOversold) && <AlertTriangle size={10} />}
      RSI {rsi.toFixed(1)}
      {isOverbought && <span className="text-warning">OB</span>}
      {isOversold && <span className="text-loss">OS</span>}
    </div>
  );
}

export function WatchlistAssetRow({ ticker, description, onRemove, isRemoving }: WatchlistAssetRowProps) {
  const price = getSimulatedPrice(ticker);
  const rsi = getSimulatedRSI(ticker);
  const { change, changePercent } = getSimulatedChange(ticker);
  const sentiment = getSentiment(ticker);
  const trend = getTrend(ticker);
  const isAlert = rsi > 70 || rsi < 30;

  return (
    <div className={cn(
      'flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-accent/20 transition-colors',
      isAlert && 'bg-warning/5'
    )}>
      {/* Ticker & Description */}
      <div className="w-28 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-sm text-foreground">{ticker}</span>
          {isAlert && <AlertTriangle size={12} className="text-warning" />}
        </div>
        <div className="text-xs text-muted-foreground truncate max-w-[100px]">{description || ticker}</div>
      </div>

      {/* Price */}
      <div className="w-28 flex-shrink-0">
        <div className="font-mono font-semibold text-sm text-foreground">
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={cn('text-xs font-mono', changePercent >= 0 ? 'text-gain' : 'text-loss')}>
          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Trend */}
      <div className="w-16 flex-shrink-0 flex items-center gap-1">
        {trend === 'up' ? (
          <TrendingUp size={16} className="text-gain" />
        ) : trend === 'down' ? (
          <TrendingDown size={16} className="text-loss" />
        ) : (
          <Minus size={16} className="text-muted-foreground" />
        )}
        <span className={cn(
          'text-xs font-mono',
          trend === 'up' ? 'text-gain' : trend === 'down' ? 'text-loss' : 'text-muted-foreground'
        )}>
          {trend === 'up' ? 'UP' : trend === 'down' ? 'DOWN' : 'FLAT'}
        </span>
      </div>

      {/* RSI */}
      <div className="w-32 flex-shrink-0">
        <RSIBadge rsi={rsi} />
      </div>

      {/* Sentiment */}
      <div className="flex-1">
        <SentimentBadge sentiment={sentiment} />
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-loss hover:bg-loss/10 flex-shrink-0"
        onClick={() => onRemove(ticker)}
        disabled={isRemoving}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
