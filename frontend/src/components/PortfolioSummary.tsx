import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PortfolioMetrics } from '@/utils/portfolioCalculations';
import { cn } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown, Shield } from 'lucide-react';

interface PortfolioSummaryProps {
  metrics: PortfolioMetrics;
}

function HealthScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? 'text-gain' : score >= 40 ? 'text-warning' : 'text-loss';
  const label = score >= 70 ? 'HEALTHY' : score >= 40 ? 'CAUTION' : 'AT RISK';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="32" fill="none" stroke="oklch(0.25 0.012 240)" strokeWidth="8" />
          <circle
            cx="40" cy="40" r="32"
            fill="none"
            stroke={score >= 70 ? 'oklch(0.72 0.18 145)' : score >= 40 ? 'oklch(0.78 0.16 75)' : 'oklch(0.58 0.22 25)'}
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 201} 201`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-lg font-mono font-bold', color)}>{score}</span>
        </div>
      </div>
      <div className={cn('text-xs font-mono font-bold', color)}>{label}</div>
    </div>
  );
}

export function PortfolioSummary({ metrics }: PortfolioSummaryProps) {
  const isPnLPositive = metrics.totalPnL >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Health Score */}
      <Card className="terminal-card border-border col-span-1">
        <CardContent className="p-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase mb-2">
            <Shield size={12} className="text-info" />
            Health Score
          </div>
          <HealthScoreGauge score={metrics.healthScore} />
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card className="terminal-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase mb-3">
            <Activity size={12} className="text-info" />
            Total P&L
          </div>
          <div className={cn('text-2xl font-mono font-bold', isPnLPositive ? 'text-gain' : 'text-loss')}>
            {isPnLPositive ? '+' : ''}${Math.abs(metrics.totalPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={cn('text-sm font-mono mt-1', isPnLPositive ? 'text-gain' : 'text-loss')}>
            {isPnLPositive ? '+' : ''}{metrics.totalPnLPercent.toFixed(2)}%
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Delta */}
      <Card className="terminal-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase mb-3">
            {metrics.totalDelta >= 0 ? <TrendingUp size={12} className="text-gain" /> : <TrendingDown size={12} className="text-loss" />}
            Portfolio Delta
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            ${metrics.totalDelta.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            {metrics.positionCount} position{metrics.positionCount !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Total Value */}
      <Card className="terminal-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground uppercase mb-3">
            <Activity size={12} className="text-info" />
            Market Value
          </div>
          <div className="text-2xl font-mono font-bold text-foreground">
            ${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="mt-2">
            <Progress
              value={Math.min(100, (metrics.totalValue / 100000) * 100)}
              className="h-1 bg-muted"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
