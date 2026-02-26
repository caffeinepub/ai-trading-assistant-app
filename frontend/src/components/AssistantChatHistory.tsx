import { ReactElement, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TradeSetupCard } from './TradeSetupCard';
import { AssistantResponse } from '@/utils/aiAssistantLogic';
import { cn } from '@/lib/utils';
import { Bot, User, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  response?: AssistantResponse;
  timestamp: Date;
}

interface AssistantChatHistoryProps {
  messages: ChatMessage[];
}

function formatMessageText(text: string): ReactElement[] {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <div key={i} className="font-bold text-foreground text-sm mb-1 mt-2 first:mt-0">
          {line.replace(/\*\*/g, '')}
        </div>
      );
    }
    if (line.startsWith('•') || line.startsWith('▸')) {
      return (
        <div key={i} className="flex gap-2 text-xs text-muted-foreground mb-0.5 ml-2">
          <span className="text-gain flex-shrink-0">▸</span>
          <span>{line.replace(/^[•▸]\s*/, '')}</span>
        </div>
      );
    }
    if (line.includes('⚠️')) {
      return <div key={i} className="text-xs text-warning mb-1">{line}</div>;
    }
    if (line.includes('✅')) {
      return <div key={i} className="text-xs text-gain mb-1">{line}</div>;
    }
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-xs text-muted-foreground mb-0.5">{line}</p>;
  });
}

function RiskBadge({ level }: { level?: 'low' | 'medium' | 'high' }): ReactElement | null {
  if (!level) return null;
  const config = {
    low: { icon: <CheckCircle size={10} />, label: 'LOW RISK', className: 'text-gain bg-gain/10 border-gain/30' },
    medium: { icon: <Info size={10} />, label: 'MED RISK', className: 'text-warning bg-warning/10 border-warning/30' },
    high: { icon: <AlertTriangle size={10} />, label: 'HIGH RISK', className: 'text-loss bg-loss/10 border-loss/30' },
  };
  const c = config[level];
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded-sm border', c.className)}>
      {c.icon} {c.label}
    </span>
  );
}

export function AssistantChatHistory({ messages }: AssistantChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <Bot size={40} className="text-muted-foreground mb-3 opacity-40" />
        <p className="text-sm text-muted-foreground font-mono">Ask me anything about the markets.</p>
        <p className="text-xs text-muted-foreground mt-1">Try: "morning briefing", "analyze NVDA", or "top setups"</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-sm bg-gain/10 border border-gain/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-gain" />
              </div>
            )}
            <div className={cn(
              'max-w-[85%] rounded-sm border px-3 py-2',
              msg.role === 'user'
                ? 'bg-secondary border-border text-foreground'
                : 'bg-card border-border'
            )}>
              {msg.role === 'user' ? (
                <p className="text-sm text-foreground">{msg.text}</p>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <RiskBadge level={msg.response?.riskLevel} />
                    <span className="text-xs font-mono text-muted-foreground ml-auto">
                      {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>{formatMessageText(msg.text)}</div>
                  {msg.response?.correlationRisk && (
                    <div className="mt-2 text-xs font-mono text-muted-foreground border-t border-border pt-2">
                      Correlation: <span className="text-warning">{msg.response.correlationRisk}</span>
                    </div>
                  )}
                  {msg.response?.tradeSetups?.map((setup, i) => (
                    <TradeSetupCard key={i} setup={setup} />
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-sm bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
