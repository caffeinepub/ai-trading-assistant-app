import { useMarketBriefing } from '@/hooks/useQueries';
import { MarketBriefingCard } from '@/components/MarketBriefingCard';
import { MacroEventsPanel } from '@/components/MacroEventsPanel';
import { OVERNIGHT_MOVES } from '@/utils/mockMarketData';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

function OvernightMoveCard({ move }: { move: typeof OVERNIGHT_MOVES[0] }) {
  const isPositive = move.changePercent >= 0;
  const isNeutral = Math.abs(move.changePercent) < 0.1;

  return (
    <Card className="terminal-card border-border hover:border-gain/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{move.ticker}</div>
            <div className="text-sm font-semibold text-foreground">{move.market}</div>
          </div>
          <div className={cn(
            'p-1.5 rounded-sm',
            isNeutral ? 'bg-muted' : isPositive ? 'bg-gain/10' : 'bg-loss/10'
          )}>
            {isNeutral ? (
              <Minus size={14} className="text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUp size={14} className="text-gain" />
            ) : (
              <TrendingDown size={14} className="text-loss" />
            )}
          </div>
        </div>
        <div className="font-mono font-bold text-lg text-foreground">
          ${move.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={cn(
          'text-sm font-mono font-semibold',
          isNeutral ? 'text-muted-foreground' : isPositive ? 'text-gain' : 'text-loss'
        )}>
          {isPositive ? '+' : ''}{move.changePercent.toFixed(2)}%
          <span className="text-xs ml-1 font-normal">
            ({isPositive ? '+' : ''}${Math.abs(move.change).toFixed(2)})
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{move.description}</p>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: briefing, isLoading } = useMarketBriefing();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src="/assets/generated/dashboard-hero.dim_1200x300.png"
          alt="Market Dashboard"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-gain" />
              <span className="text-xs font-mono text-gain uppercase tracking-widest">Market Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Daily Market Overview</h1>
            <p className="text-sm text-muted-foreground font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overnight Moves */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Overnight Moves</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {OVERNIGHT_MOVES.map((move) => (
              <OvernightMoveCard key={move.ticker} move={move} />
            ))}
          </div>
        </section>

        {/* Briefing + Events */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">AI Briefing</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <MarketBriefingCard briefing={briefing} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Macro Calendar</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <MacroEventsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
