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

interface AddPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (params: {
    ticker: string;
    entryPrice: number;
    quantity: number;
    stopLoss: number | null;
    takeProfit: number | null;
  }) => Promise<void>;
  isAdding: boolean;
}

export function AddPositionDialog({ open, onOpenChange, onAdd, isAdding }: AddPositionDialogProps) {
  const [ticker, setTicker] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = ticker.trim().toUpperCase();
    const ep = parseFloat(entryPrice);
    const qty = parseFloat(quantity);

    if (!t) { setError('Ticker is required'); return; }
    if (isNaN(ep) || ep <= 0) { setError('Valid entry price is required'); return; }
    if (isNaN(qty) || qty <= 0) { setError('Valid quantity is required'); return; }

    setError('');
    try {
      await onAdd({
        ticker: t,
        entryPrice: ep,
        quantity: qty,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      });
      setTicker(''); setEntryPrice(''); setQuantity(''); setStopLoss(''); setTakeProfit('');
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add position');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-widest text-foreground flex items-center gap-2">
            <Plus size={14} className="text-gain" />
            Add Position
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Enter position details to track in your portfolio.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase">Ticker *</Label>
              <Input
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="AAPL"
                className="font-mono bg-input border-border text-foreground uppercase"
                maxLength={10}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase">Quantity *</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                className="font-mono bg-input border-border text-foreground"
                min="0.001"
                step="any"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-muted-foreground uppercase">Entry Price *</Label>
            <Input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="189.50"
              className="font-mono bg-input border-border text-foreground"
              min="0.001"
              step="any"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase">Stop Loss</Label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="180.00"
                className="font-mono bg-input border-border text-foreground"
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase">Take Profit</Label>
              <Input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="210.00"
                className="font-mono bg-input border-border text-foreground"
                min="0"
                step="any"
              />
            </div>
          </div>
          {error && <p className="text-xs text-loss font-mono">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding}
              className="bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 font-mono"
            >
              {isAdding ? <Loader2 size={14} className="animate-spin mr-2" /> : <Plus size={14} className="mr-2" />}
              Add Position
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
