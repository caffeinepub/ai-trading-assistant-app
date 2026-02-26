import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (ticker: string, description: string) => Promise<void>;
  isAdding: boolean;
}

export function AddAssetDialog({ open, onOpenChange, onAdd, isAdding }: AddAssetDialogProps) {
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = ticker.trim().toUpperCase();
    if (!t) {
      setError('Ticker symbol is required');
      return;
    }
    setError('');
    try {
      await onAdd(t, description.trim());
      setTicker('');
      setDescription('');
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add asset';
      setError(msg.includes('already') ? 'Asset already in watchlist' : msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
            <Plus size={14} className="text-gain" />
            Add to Watchlist
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Enter a ticker symbol to track in your watchlist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-muted-foreground uppercase">Ticker Symbol *</Label>
            <Input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL, BTC, SPY"
              className="font-mono bg-input border-border text-foreground placeholder:text-muted-foreground uppercase"
              maxLength={10}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-muted-foreground uppercase">Description (optional)</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Apple Inc."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {error && (
            <p className="text-xs text-loss font-mono">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding || !ticker.trim()}
              className="bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 font-mono"
            >
              {isAdding ? <Loader2 size={14} className="animate-spin mr-2" /> : <Plus size={14} className="mr-2" />}
              Add Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
