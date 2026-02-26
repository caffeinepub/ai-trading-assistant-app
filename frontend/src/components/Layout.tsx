import { ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, List, Briefcase, Bot, TrendingUp, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
  { label: 'Watchlist', path: '/watchlist', icon: <List size={18} /> },
  { label: 'Portfolio', path: '/portfolio', icon: <Briefcase size={18} /> },
  { label: 'AI Assistant', path: '/ai-assistant', icon: <Bot size={18} /> },
];

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <img
            src="/assets/generated/tradeiq-logo.dim_128x128.png"
            alt="TradeIQ Logo"
            className="w-8 h-8 rounded-sm object-cover"
          />
          <div>
            <div className="font-bold text-sm text-foreground tracking-wider">TRADE<span className="text-gain">IQ</span></div>
            <div className="text-xs text-muted-foreground font-mono">v2.6.0</div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-sidebar-border">
          <span className="w-2 h-2 rounded-full bg-gain animate-pulse-green" />
          <span className="text-xs font-mono text-gain">LIVE MARKET</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-gain/10 text-gain border border-gain/30 glow-green'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground border border-transparent'
                )}
              >
                <span className={isActive ? 'text-gain' : 'text-muted-foreground'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Market status */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground font-mono mb-1">MARKET STATUS</div>
          <div className="flex items-center gap-2">
            <TrendingUp size={12} className="text-gain" />
            <span className="text-xs font-mono text-gain">NYSE OPEN</span>
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-1">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            Built with <Heart size={10} className="inline text-loss" fill="currentColor" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'tradeiq-app')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gain hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-0.5">
            © {new Date().getFullYear()} TradeIQ
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}
