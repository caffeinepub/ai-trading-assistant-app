import { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { DEFAULT_BRIEFING } from '@/utils/mockMarketData';

interface MarketBriefingCardProps {
  briefing: string | null | undefined;
  isLoading: boolean;
}

function formatBriefingText(text: string): ReactElement[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <div key={i} className="font-bold text-foreground text-sm mb-2 mt-3 first:mt-0">
          {line.replace(/\*\*/g, '')}
        </div>
      );
    }
    if (line.startsWith('•')) {
      return (
        <div key={i} className="flex gap-2 text-sm text-muted-foreground mb-1 ml-2">
          <span className="text-gain flex-shrink-0">▸</span>
          <span>{line.slice(1).trim()}</span>
        </div>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return (
      <p key={i} className="text-sm text-muted-foreground mb-1">
        {line}
      </p>
    );
  });
}

export function MarketBriefingCard({ briefing, isLoading }: MarketBriefingCardProps) {
  const content = briefing ?? DEFAULT_BRIEFING;

  return (
    <Card className="terminal-card border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-mono text-foreground uppercase tracking-widest">
            <FileText size={14} className="text-gain" />
            Daily Market Briefing
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono border-gain/40 text-gain bg-gain/10">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Badge>
            {!briefing && (
              <Badge variant="outline" className="text-xs font-mono border-warning/40 text-warning bg-warning/10">
                DEFAULT
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-5/6 bg-muted" />
            <Skeleton className="h-4 w-4/6 bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        ) : (
          <div className="space-y-0.5">{formatBriefingText(content)}</div>
        )}
      </CardContent>
    </Card>
  );
}
