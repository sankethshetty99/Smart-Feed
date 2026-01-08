# Robinhood Smart Feed Prototype - Product Requirements Document

## Overview

A mobile-first web application that provides retail traders with a personalized "smart feed" of AI-aggregated trading news and opportunities. The app mimics Robinhood's clean aesthetic while delivering curated stock news based on user holdings and watchlist preferences.

## Product Vision

Create a passive discovery investing experience similar to a social media feed, where users can scroll through personalized stock news with sentiment indicators, price changes, and actionable insights without actively searching.

## Target Users

- **Primary**: Casual retail traders who want to stay informed about their portfolio
- **Secondary**: New investors looking for curated market insights
- **Tertiary**: Active traders seeking quick sentiment analysis on stocks

## Core Features

### 1. Smart Feed (Home Page)
- **Personalized news feed** displaying stock-related news cards
- **Prioritization algorithm**: 
  1. News about stocks user currently holds
  2. News about stocks on user's watchlist
  3. Trending/high-sentiment general market news
- **Feed card components**:
  - Stock ticker badge (clickable, navigates to stock detail)
  - AI-generated summary headline
  - Sentiment indicator (bullish/bearish with color coding)
  - Source count and primary source name
  - Relative timestamp
  - Daily price change percentage
- **Pull-to-refresh** functionality
- **Infinite scroll** for additional content

### 2. News Detail Page
- **Expanded view** of a feed item when tapped
- **Full AI summary** with key points
- **Affected stocks section** showing related tickers
- **Sentiment breakdown** with visual indicators
- **Sources section** with clickable links to original articles
- **Navigation** back to feed

### 3. Stock Detail Page (Robinhood-style)
- **Stock header** with ticker, company name, current price
- **Price chart** with timeframe selectors (1D, 1W, 1M, 3M, 1Y, ALL)
- **Key statistics** (day's range, volume, market cap, P/E ratio)
- **Company description/about section**
- **Related news** for this specific stock
- **Trade action bar** (fixed footer with Buy/Sell buttons - prototype only)

### 4. Search Page
- **Stock search functionality** by ticker or company name
- **Recent searches** history
- **Trending stocks** section
- **Category filters** (Tech, Healthcare, Finance, etc.)

### 5. Profile Page
- **User information display**
- **Holdings summary** (stocks user owns)
- **Watchlist management**
- **Risk tolerance preference** (low/medium/high)
- **Settings/preferences**

## Design Specifications

### Visual Design
- **Theme**: Robinhood-inspired clean, modern aesthetic
- **Color Scheme**:
  - Primary Green: `#00C805` (bullish/positive)
  - Primary Red: `#FF5000` (bearish/negative)
  - Background: White (light mode) / Near-black (dark mode)
  - Cards: Subtle elevation with soft shadows
- **Typography**: Clean sans-serif (system fonts)
- **Spacing**: Consistent 16px base unit

### Dark/Light Mode
- Full dark mode support
- Theme toggle accessible from any page
- Colors adapt for readability in both modes

### Responsive Design
- **Mobile-first** (primary target: 375px-428px width)
- **Tablet support** (768px-1024px)
- **Desktop support** (1024px+) with centered max-width container
- Bottom navigation on mobile, hidden on stock detail pages with trade footer

## Technical Architecture

### Frontend Stack
- **Framework**: React with Vite
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query v5
- **Styling**: Tailwind CSS with custom theme variables
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion for list transitions
- **Icons**: Lucide React

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (shared types between client/server)
- **ORM**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas

### Database Schema

```sql
-- Users table
users (
  id: serial primary key,
  username: text not null,
  risk_tolerance: text default 'medium' -- 'low', 'medium', 'high'
)

-- Stocks table
stocks (
  ticker: text primary key,
  company_name: text not null,
  sector: text,
  current_price: numeric not null,
  day_change_percent: numeric
)

-- User interests (holdings + watchlist)
user_interests (
  id: serial primary key,
  user_id: integer references users(id),
  ticker: text references stocks(ticker),
  interest_type: text not null -- 'holding', 'watchlist'
)

-- Feed items (news articles)
feed_items (
  id: serial primary key,
  ticker: text references stocks(ticker),
  summary_headline: text not null,
  sentiment_score: numeric, -- -1.0 to 1.0
  source_count: integer,
  primary_source_name: text,
  published_at: timestamp
)
```

### API Endpoints

```
GET /api/feed/:userId     - Fetch personalized smart feed
GET /api/news/:id         - Get single news item detail
GET /api/users/:id        - Get user profile
GET /api/users            - List all users
GET /api/stocks/:ticker   - Get stock details
POST /api/seed            - Seed database with sample data
```

### Key Files Structure

```
client/
  src/
    App.tsx              - Main app with routing
    pages/
      Feed.tsx           - Home feed page
      NewsDetail.tsx     - News article detail
      StockDetail.tsx    - Stock detail with chart
      Search.tsx         - Search page
      Profile.tsx        - User profile
      SourcesDetail.tsx  - News sources list
    components/
      BottomNav.tsx      - Mobile bottom navigation
      FeedCard.tsx       - News card component
      SentimentBadge.tsx - Sentiment indicator
      StockBadge.tsx     - Clickable ticker badge
    lib/
      queryClient.ts     - React Query configuration

server/
  index.ts              - Express server entry
  routes.ts             - API route handlers
  storage.ts            - Database operations
  db.ts                 - Drizzle DB connection

shared/
  schema.ts             - Drizzle schema + Zod validators
  routes.ts             - API route definitions
```

## User Flows

### Primary Flow: Browsing Feed
1. User opens app → lands on Feed page
2. Feed loads personalized news based on holdings/watchlist
3. User scrolls through cards, sees sentiment and price changes
4. User taps a card → navigates to News Detail
5. User taps stock ticker badge → navigates to Stock Detail

### Secondary Flow: Exploring a Stock
1. User taps ticker from any page
2. Stock Detail loads with price, chart, stats
3. User can switch chart timeframes
4. User sees related news for this stock
5. User can tap Buy/Sell (prototype - no actual trading)

### Tertiary Flow: Search
1. User taps Search tab
2. Types stock ticker or company name
3. Results appear as user types
4. User taps result → navigates to Stock Detail

## Sample Data

### Mock Stocks
- TSLA (Tesla) - Consumer Cyclical
- NVDA (NVIDIA) - Technology
- AAPL (Apple) - Technology
- AMZN (Amazon) - Consumer Cyclical
- MSFT (Microsoft) - Technology
- GOOGL (Alphabet) - Technology
- META (Meta) - Technology
- JPM (JPMorgan) - Financial Services
- V (Visa) - Financial Services
- JNJ (Johnson & Johnson) - Healthcare
- NFLX (Netflix) - Communication Services
- AMD (AMD) - Technology
- DIS (Disney) - Communication Services

### Mock News Headlines (AI-style summaries)
- "Q4 EV Deliveries Surge Past Analyst Expectations Amid Global Demand Spike"
- "New Export Controls Spark Uncertainty in Semiconductor Supply Chains"
- "Cloud Computing Revenue Surges as Enterprise AI Adoption Accelerates"
- "Banking Sector Rallies on Stronger-Than-Expected Loan Growth Data"

## Acceptance Criteria

### Feed Page
- [ ] Displays minimum 5 news cards on load
- [ ] Cards show ticker, headline, sentiment, source, timestamp
- [ ] Sentiment color: green for positive (>0.3), red for negative (<-0.3), neutral otherwise
- [ ] Tapping card navigates to detail page
- [ ] Tapping ticker badge navigates to stock page
- [ ] Loading state shown while fetching

### News Detail Page
- [ ] Shows full headline and summary
- [ ] Displays affected stock with current price
- [ ] Shows all sources with source count
- [ ] Back navigation works correctly

### Stock Detail Page
- [ ] Displays ticker, company name, current price
- [ ] Shows daily change percentage with color
- [ ] Chart area with timeframe buttons (1D, 1W, 1M, 3M, 1Y, ALL)
- [ ] Fixed trade bar at bottom (Buy/Sell buttons)
- [ ] Timeframe buttons scroll horizontally on mobile

### Responsive Design
- [ ] Mobile layout with bottom navigation
- [ ] Desktop layout with centered container
- [ ] Bottom nav hidden on pages with own footer (Stock Detail)
- [ ] All pages have proper padding for fixed elements

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Feed API response < 500ms
- [ ] Smooth scrolling and transitions

## Future Enhancements (Not in MVP)

1. **Real-time stock prices** via WebSocket
2. **Push notifications** for significant price moves
3. **AI-powered news aggregation** from real sources
4. **Portfolio tracking** with P&L calculations
5. **Social features** - share news, follow traders
6. **Advanced charts** with technical indicators
7. **Price alerts** and custom watchlists
8. **Authentication** with secure login

## Environment Variables

```
DATABASE_URL      - PostgreSQL connection string
SESSION_SECRET    - Session encryption key
NODE_ENV          - 'development' or 'production'
PORT              - Server port (default: 5000)
```

## Deployment Notes

- App auto-seeds database on startup if empty or data mismatch
- Production database is separate from development
- Schema changes auto-migrate on deployment
- Static files served from `/dist/public` in production
