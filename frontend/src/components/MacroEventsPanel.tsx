import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { MACRO_EVENTS, MacroEvent } from '@/utils/mockMarketData';
import { cn } from '@/lib/utils';

function StatusBadge({ event }: { event: MacroEvent }) {
  if (event.status === 'alert') {
    return (
      <Badge className="text-xs font-mono bg-loss/20 text-loss border border-loss/40 gap-1">
        <AlertTriangle size={10} />
        ALERT
      </Badge>
    );
  }
  if (event.status === 'released') {
    return (
      <Badge className="text-xs font-mono bg-gain/10 text-gain border border-gain/30 gap-1">
        <CheckCircle size={10} />
        RELEASED
      </Badge>
    );
  }
  return (
    <Badge className="text-xs font-mono bg-muted text-muted-foreground border border-border gap-1">
      <Clock size={10} />
      UPCOMING
    </Badge>
  );
}

export function MacroEventsPanel() {
  return (
    <Card className="terminal-card border-border">
      <CardHeader className="pb-3 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-sm font-mono text-foreground uppercase tracking-widest">
          <Calendar size={14} className="text-info" />
          Macro Events Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-0">
        <div className="divide-y divide-border">
          {MACRO_EVENTS.map((event) => (
            <div
              key={event.id}
              className={cn(
                'px-4 py-3 flex items-center gap-3 hover:bg-accent/30 transition-colors',
                event.status === 'alert' && 'bg-loss/5'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground truncate">{event.name}</span>
                  {event.deviation != null && Math.abs(event.deviation) > 5 && (
                    <AlertTriangle size={12} className="text-warning flex-shrink-0" />
                  )}
                </div>
                <div className="text-xs font-mono text-muted-foreground">{event.date}</div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div>
                    <div className="text-muted-foreground">EXP</div>
                    <div className="text-foreground">{event.expected}</div>
                  </div>
                  {event.actual != null && (
                    <div>
                      <div className="text-muted-foreground">ACT</div>
                      <div className={cn(
                        event.deviation != null && Math.abs(event.deviation) > 5
                          ? 'text-warning'
                          : 'text-gain'
                      )}>
                        {event.actual}
                      </div>
                    </div>
                  )}
                  {event.deviation != null && (
                    <div>
                      <div className="text-muted-foreground">DEV</div>
                      <div className={cn(
                        Math.abs(event.deviation) > 5 ? 'text-warning' : 'text-muted-foreground'
                      )}>
                        {event.deviation > 0 ? '+' : ''}{event.deviation.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <StatusBadge event={event} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
