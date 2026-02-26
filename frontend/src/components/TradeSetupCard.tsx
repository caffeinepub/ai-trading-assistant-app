import { TradeSetup } from '@/utils/aiAssistantLogic';
import { cn } from '@/lib/utils';
import { Target, ShieldAlert, TrendingUp, BarChart2 } from 'lucide-react';

interface TradeSetupCardProps {
  setup: TradeSetup;
}

export function TradeSetupCard({ setup }: TradeSetupCardProps) {
  const rr = parseFloat(setup.riskReward);
  const isGoodRR = rr >= 2;

  return (
    <div className="border border-border rounded-sm bg-card/50 overflow-hidden mt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <BarChart2 size={12} className="text-gain" />
          <span className="font-mono font-bold text-sm text-foreground">{setup.ticker}</span>
          {setup.pattern && (
            <span className="text-xs font-mono text-info bg-info/10 border border-info/30 px-1.5 py-0.5 rounded-sm">
              {setup.pattern}
            </span>
          )}
          {setup.timeframe && (
            <span className="text-xs font-mono text-muted-foreground">{setup.timeframe}</span>
          )}
        </div>
        <span className={cn(
          'text-xs font-mono font-bold px-2 py-0.5 rounded-sm border',
          isGoodRR ? 'text-gain bg-gain/10 border-gain/30' : 'text-warning bg-warning/10 border-warning/30'
        )}>
          R/R {setup.riskReward}
        </span>
      </div>

      {/* Trade levels */}
      <div className="grid grid-cols-3 divide-x divide-border">
        <div className="px-3 py-2">
          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-1">
            <TrendingUp size={10} className="text-gain" />
            ENTRY
          </div>
          <div className="font-mono font-bold text-sm text-gain">
            ${setup.entry.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-1">
            <ShieldAlert size={10} className="text-loss" />
            STOP LOSS
          </div>
          <div className="font-mono font-bold text-sm text-loss">
            ${setup.stopLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-1">
            <Target size={10} className="text-gain" />
            TAKE PROFIT
          </div>
          <div className="font-mono font-bold text-sm text-gain">
            ${setup.takeProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div className="px-3 py-2 border-t border-border bg-muted/10">
        <p className="text-xs text-muted-foreground">{setup.rationale}</p>
      </div>
    </div>
  );
}
