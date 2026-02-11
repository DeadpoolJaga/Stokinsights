# 📈 StokInsights

StokInsights is a modern stock research prototype inspired by Robinhood-style UI but focused on **analysis, comparison, live updates and AI-driven predictions**, not trading.

This project demonstrates frontend engineering, API integration, Deterministic Prediction modeling, and scalable system design thinking.


## 🚀 Problem Statement

Most retail trading platforms focus heavily on buy/sell mechanics, but lack structured, comparative, and contextual research tools.

StokInsights solves this by:

- 📊 Displaying clean historical price visualization (1D / 1W / 3M / 1Y / 5Y)
- 🧠 Providing an experimental AI-based prediction signal (momentum + technical indicators)
- 🔍 Enabling structured stock comparison
- 📰 Surfacing highlights and summarize latest updates

Instead of encouraging transactions, it encourages understanding and analysis.


## 🧠 Design Philosophy

This project was built around:

- Clean dark modern UI
- Modular client/server separation (Next.js App Router)
- API abstraction layer
- Expandable architecture (future S&P500 scale)
- Fast prototype iteration with production-minded structure
- Mobile-first responsive design


## 🏗 Architecture Overview

Client (React + Tailwind)  
↓  
Next.js App Router  
↓  
API Routes (/api/quote, /api/history, /api/signal)  
↓  
External Market Data Source (Stooq / AlphaVantage)  

### Key Design Decisions

- **Server Components** for routing and layout
- **Client Components** for interactive elements (charts, buttons, signals)
- Lightweight chart rendering using `lightweight-charts`
- Tailwind CSS for modern responsive UI
- Symbol abstraction layer for scalability
- Separation of prediction signal logic into reusable module


## ⚙️ Tech Stack

### Frontend
- Next.js (App Router)
- React (Client + Server Components)
- TypeScript
- Tailwind CSS
- Lightweight Charts (TradingView)

### Backend (via Next.js API Routes)
- REST-style endpoints
- External stock data APIs (Stooq / Alpha Vantage)
- Custom quantitative signal computation

### Deployment Ready
- Vercel compatible
- Environment-based API keys
- Easily containerizable
- Structured for future AWS serverless migration


## 🧠 AI Signal (Experimental)

The AI Signal is a lightweight rule-based quantitative prediction model that evaluates:

- Price vs 20-day moving average
- Price vs 50-day moving average
- RSI (Relative Strength Index)
- Short-term momentum
- Volume deviation from 20-day average

Each metric contributes to a weighted score, producing:

- ⬆ Up Signal
- ⬇ Down Signal
- Confidence %

This is NOT financial advice — it is a demonstration of:

- Feature engineering
- Indicator computation
- Lightweight modeling
- Data-to-UI transformation
- Signal confidence scoring


## 📂 Folder Structure

```
src/
├── app/
│   ├── page.tsx
│   ├── stock/[symbol]/
│   │   ├── page.tsx
│   │   ├── signal.client.tsx
│   │   ├── quote.client.tsx
│   │   └── tabs.client.tsx
│   └── api/
│       ├── quote/
│       ├── history/
│       └── signal/
├── components/
│   ├── StockChart.tsx
│   ├── RangeButtons.tsx
│   └── Logo.tsx
├── lib/
│   ├── logos.ts
│   ├── symbols.ts
│   └── signalLogic.ts
```


## 🛠 How to Run Locally

### 1. Clone repository

```
git clone https://github.com/your-username/stokinsights.git
cd stokinsights
```

### 2. Install dependencies

```
npm install
```

### 3. Run development server

```
npm run dev
```

### 4. Open in browser

```
http://localhost:3000
```


## 📊 Current Features

- Responsive dark-mode UI
- Watchlist grid layout with logos
- Historical price charts (1D / 1W / 3M / 1Y / 5Y)
- Real-time quote display
- AI signal indicator with confidence scoring
- Modular API routing structure
- Clean mobile-friendly layout


## 🌍 Future Enhancements

- 🔎 Search bar with autocomplete
- 📊 Mini sparklines in watchlist cards
- 📈 Multi-stock comparison view with overlay charts
- 📰 AI-generated highlights (news summarization)
- ⚡ Caching layer (Redis / edge caching)
- 📦 AWS serverless deployment
- 📊 Real ML-based predictive modeling
- 🔐 Authentication + personalized watchlists
- 📡 WebSocket live updates


## 📌 Scalability Plan

To scale from 50 stocks → S&P 500:

- Introduce caching layer
- Precompute daily indicators
- Add persistent database (Postgres / DynamoDB)
- Move signal calculation to serverless compute
- Introduce background update queue
- Optimize API rate limiting
- Add edge caching for charts


## 🧪 Performance Considerations

Initial load latency can occur due to:

- External API calls
- Cold start behavior
- Chart rendering initialization
- Network fetch delays

Future improvements include:

- API caching
- Data prefetching
- Static generation for popular stocks
- Incremental revalidation

## 👨‍💻 Author

Ideated, Designed and Built by Jagadeesh Bodavula  
Focused on systems design, distributed systems, scalable architectures, and applied AI experimentation.
