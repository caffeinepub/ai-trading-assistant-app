import { useState } from 'react';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '@/hooks/useQueries';
import { WatchlistAssetRow } from '@/components/WatchlistAssetRow';
import { AddAssetDialog } from '@/components/AddAssetDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, List, AlertTriangle } from 'lucide-react';

export function Watchlist() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: watchlist, isLoading } = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const handleAdd = async (ticker: string, description: string) => {
    await addMutation.mutateAsync({ ticker, description });
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
            <List size={16} className="text-gain" />
            <span className="text-xs font-mono text-gain uppercase tracking-widest">Watchlist</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Asset Watchlist</h1>
          <p className="text-sm text-muted-foreground">
            Track assets with real-time technical indicators and sentiment analysis
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 font-mono text-xs"
        >
          <Plus size={14} className="mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={10} className="text-warning" />
          <span>RSI Alert (OB/OS)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gain" />
          <span>Bullish Sentiment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-loss" />
          <span>Bearish Sentiment</span>
        </div>
      </div>

      {/* Table */}
      <div className="terminal-card overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/30">
          <div className="w-28 text-xs font-mono text-muted-foreground uppercase">Ticker</div>
          <div className="w-28 text-xs font-mono text-muted-foreground uppercase">Price</div>
          <div className="w-16 text-xs font-mono text-muted-foreground uppercase">Trend</div>
          <div className="w-32 text-xs font-mono text-muted-foreground uppercase">RSI (4H)</div>
          <div className="flex-1 text-xs font-mono text-muted-foreground uppercase">Sentiment</div>
          <div className="w-8" />
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted" />
            ))}
          </div>
        ) : !watchlist || watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <List size={40} className="text-muted-foreground mb-3 opacity-30" />
            <p className="text-sm text-muted-foreground font-mono">No assets in watchlist</p>
            <p className="text-xs text-muted-foreground mt-1">Click "Add Asset" to start tracking</p>
            <Button
              onClick={() => setDialogOpen(true)}
              variant="outline"
              className="mt-4 border-gain/40 text-gain hover:bg-gain/10 font-mono text-xs"
            >
              <Plus size={12} className="mr-2" />
              Add Your First Asset
            </Button>
          </div>
        ) : (
          <div>
            {watchlist.map(([ticker, description]) => (
              <WatchlistAssetRow
                key={ticker}
                ticker={ticker}
                description={description}
                onRemove={handleRemove}
                isRemoving={removeMutation.isPending && removeMutation.variables === ticker}
              />
            ))}
          </div>
        )}
      </div>

      <AddAssetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAdd}
        isAdding={addMutation.isPending}
      />
    </div>
  );
}
