# Specification

## Summary
**Goal:** Build TradeIQ, a dark-themed professional trading terminal app with a market dashboard, watchlist, portfolio overview, and an AI trading assistant — all using simulated/mocked data.

**Planned changes:**
- Backend actor storing watchlist assets, portfolio positions (entry price, quantity, stop-loss, take-profit), and daily market briefing content, with CRUD operations exposed
- Market Dashboard page (default landing view) showing a daily morning briefing card (S&P 500, Crypto, Nasdaq-100 overnight moves) and a macro events calendar panel (CPI, earnings) with expected vs. actual deviation indicators
- Watchlist page displaying tracked assets with simulated prices, RSI values, trend direction, visual alert badges (RSI > 70 or < 30), and per-asset sentiment badges (Bullish / Neutral / Bearish); supports adding/removing assets persisted to backend
- Portfolio Overview page showing active positions (entry price, simulated current price, P&L, stop-loss distance), a Health Score gauge (0–100), total portfolio delta, amber/red highlights for positions within 5% of stop-loss, and a drawdown alert banner with three exit/hedge scenarios when simulated sector drawdown ≥ 10%
- AI Trading Assistant panel accessible from all pages with three mode tabs — Daily Strategist (trade setups with Entry/Stop-Loss/Take-Profit), Risk & Portfolio Guard (correlation risk summary), Alpha Hunter (3 simulated breakout setups) — using pre-scripted rule-based responses in a scrollable chat interface
- Dark charcoal terminal-style UI across all pages: electric green for gains, crimson for losses, amber for warnings, monospaced font for numeric data, persistent left navigation bar, card/panel layout with subtle grid-line borders
- App logo displayed in the top of the left nav bar; hero banner displayed at the top of the Market Dashboard

**User-visible outcome:** Users can view a daily market briefing, manage a watchlist with technical alerts and sentiment, review portfolio health with drawdown warnings, and query a multi-mode AI assistant — all within a professional dark trading terminal interface.
