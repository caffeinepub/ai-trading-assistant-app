import { useState } from 'react';
import { usePortfolioPositions, useAddOrUpdatePosition, useRemovePosition } from '@/hooks/useQueries';
import { PortfolioSummary } from '@/components/PortfolioSummary';
import { PositionRow } from '@/components/PositionRow';
import { DrawdownAlertBanner } from '@/components/DrawdownAlertBanner';
import { AddPositionDialog } from '@/components/AddPositionDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { enrichPositions, calculatePortfolioMetrics, getSectorDrawdownAlerts } from '@/utils/portfolioCalculations';
import { Plus, Briefcase } from 'lucide-react';

export function Portfolio() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: positions, isLoading } = usePortfolioPositions();
  const addMutation = useAddOrUpdatePosition();
  const removeMutation = useRemovePosition();

  const enriched = enrichPositions(positions ?? []);
  const metrics = calculatePortfolioMetrics(enriched);
  const drawdownAlerts = getSectorDrawdownAlerts();

  const handleAdd = async (params: {
    ticker: string;
    entryPrice: number;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => {
    await addMutation.mutateAsync(params);
  };

  const handleRemove = async (ticker: string) => {
    await removeMutation.mutateAsync(ticker);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={16} className="text-gain" />
            <span className="text-xs font-mono text-gain uppercase tracking-widest">Portfolio</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio Overview</h1>
          <p className="text-sm text-muted-foreground">
            Track positions, P&L, and portfolio health in real-time
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 font-mono text-xs"
        >
          <Plus size={14} className="mr-2" />
          Add Position
        </Button>
      </div>

      {/* Drawdown Alerts */}
      {drawdownAlerts.length > 0 && (
        <div className="mb-6">
          <DrawdownAlertBanner alerts={drawdownAlerts} />
        </div>
      )}

      {/* Summary Metrics */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Portfolio Metrics</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <PortfolioSummary metrics={metrics} />
      </div>

      {/* Positions Table */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Active Positions</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="terminal-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase">Ticker</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase">Entry</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase">Current</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase">P&L</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase">Stop Loss</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase">Take Profit</th>
                <th className="px-4 py-2 text-left text-xs font-mono text-muted-foreground uppercase w-12"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-4">
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full bg-muted" />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : enriched.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Briefcase size={40} className="text-muted-foreground mb-3 opacity-30" />
                      <p className="text-sm text-muted-foreground font-mono">No positions in portfolio</p>
                      <p className="text-xs text-muted-foreground mt-1">Click "Add Position" to start tracking</p>
                      <Button
                        onClick={() => setDialogOpen(true)}
                        variant="outline"
                        className="mt-4 border-gain/40 text-gain hover:bg-gain/10 font-mono text-xs"
                      >
                        <Plus size={12} className="mr-2" />
                        Add Your First Position
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                enriched.map((position) => (
                  <PositionRow
                    key={position.ticker}
                    position={position}
                    onRemove={handleRemove}
                    isRemoving={removeMutation.isPending && removeMutation.variables === position.ticker}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddPositionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAdd}
        isAdding={addMutation.isPending}
      />
    </div>
  );
}
