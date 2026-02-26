import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, TrendingDown, Shield, ArrowDownRight } from 'lucide-react';
import { SectorDrawdownAlert } from '@/utils/portfolioCalculations';

interface DrawdownAlertBannerProps {
  alerts: SectorDrawdownAlert[];
}

const HEDGE_SCENARIOS = [
  {
    icon: <ArrowDownRight size={14} />,
    title: 'Exit 50% of Position',
    description: 'Reduce exposure by half to lock in remaining capital and limit further downside.'
  },
  {
    icon: <Shield size={14} />,
    title: 'Add Protective Puts',
    description: 'Purchase put options 5-10% OTM as insurance against continued decline.'
  },
  {
    icon: <TrendingDown size={14} />,
    title: 'Rebalance to Defensive Sector',
    description: 'Rotate into utilities, healthcare, or consumer staples to reduce beta exposure.'
  }
];

export function DrawdownAlertBanner({ alerts }: DrawdownAlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.sector} className="border border-loss/40 rounded-sm bg-loss/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-loss" />
            <span className="font-mono font-bold text-sm text-loss uppercase tracking-wider">
              DRAWDOWN ALERT — {alert.sector} Sector
            </span>
            <span className="font-mono text-sm text-loss ml-auto">
              -{alert.drawdown.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            The {alert.sector} sector has experienced a {alert.drawdown.toFixed(1)}% drawdown. Consider the following risk management actions:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {HEDGE_SCENARIOS.map((scenario, i) => (
              <div key={i} className="bg-card border border-border rounded-sm p-3">
                <div className="flex items-center gap-1.5 text-warning mb-1">
                  {scenario.icon}
                  <span className="text-xs font-mono font-bold text-warning">{scenario.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
