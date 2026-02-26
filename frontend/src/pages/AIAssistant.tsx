import { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AssistantChatHistory, ChatMessage } from '@/components/AssistantChatHistory';
import { usePortfolioPositions } from '@/hooks/useQueries';
import { generateResponse, AssistantMode } from '@/utils/aiAssistantLogic';
import { Bot, Send, Zap, Shield, Target, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MODE_CONFIG = {
  strategist: {
    label: 'Daily Strategist',
    icon: <Zap size={14} />,
    description: 'Morning briefings, technical alerts, and risk-managed trade setups',
    prompts: ['Morning briefing', 'Analyze NVDA', 'Analyze BTC', 'Market outlook']
  },
  guard: {
    label: 'Risk & Portfolio Guard',
    icon: <Shield size={14} />,
    description: 'Portfolio health checks, correlation risk, and drawdown protection',
    prompts: ['Portfolio health check', 'Analyze adding TSLA', 'Check correlation risk', 'Stop-loss review']
  },
  hunter: {
    label: 'Alpha Hunter',
    icon: <Target size={14} />,
    description: 'Scan for breakout patterns and high-probability trade setups',
    prompts: ['Top 3 setups today', 'Backtest NVDA bull flag', 'Bull flag scanner', 'Double bottom setups']
  }
};

export function AIAssistant() {
  const [mode, setMode] = useState<AssistantMode>('strategist');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: positions } = usePortfolioPositions();

  const handleModeChange = (newMode: string) => {
    setMode(newMode as AssistantMode);
    setMessages([]);
  };

  const handleSend = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const response = generateResponse(mode, query, positions ?? []);
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: response.text,
      response,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentConfig = MODE_CONFIG[mode];

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={16} className="text-gain" />
          <span className="text-xs font-mono text-gain uppercase tracking-widest">AI Assistant</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Trading AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Intelligent market analysis powered by rule-based trading logic
        </p>
      </div>

      <Tabs value={mode} onValueChange={handleModeChange} className="space-y-4">
        {/* Mode Tabs */}
        <TabsList className="bg-card border border-border p-1 h-auto gap-1">
          {(Object.entries(MODE_CONFIG) as [AssistantMode, typeof MODE_CONFIG[AssistantMode]][]).map(([key, config]) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-sm transition-all',
                'data-[state=active]:bg-gain/10 data-[state=active]:text-gain data-[state=active]:border data-[state=active]:border-gain/30',
                'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground'
              )}
            >
              {config.icon}
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(MODE_CONFIG) as AssistantMode[]).map((key) => (
          <TabsContent key={key} value={key} className="mt-0">
            <div className="terminal-card flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
              {/* Mode description */}
              <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center gap-3">
                <div className={cn(
                  'p-1.5 rounded-sm',
                  key === 'strategist' ? 'bg-info/10 text-info' :
                  key === 'guard' ? 'bg-warning/10 text-warning' :
                  'bg-gain/10 text-gain'
                )}>
                  {MODE_CONFIG[key].icon}
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-foreground">{MODE_CONFIG[key].label}</div>
                  <div className="text-xs text-muted-foreground">{MODE_CONFIG[key].description}</div>
                </div>
              </div>

              {/* Chat History */}
              <AssistantChatHistory messages={messages} />

              {/* Quick prompts */}
              {messages.length === 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {MODE_CONFIG[key].prompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-xs font-mono px-3 py-1.5 rounded-sm border border-border text-muted-foreground hover:border-gain/40 hover:text-gain hover:bg-gain/5 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask the ${MODE_CONFIG[key].label}...`}
                    className="flex-1 min-h-[44px] max-h-[120px] bg-input border-border text-foreground placeholder:text-muted-foreground font-mono text-sm resize-none"
                    rows={1}
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isProcessing}
                    className="bg-gain/20 text-gain border border-gain/40 hover:bg-gain/30 h-11 px-4 flex-shrink-0"
                  >
                    {isProcessing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-1.5">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
