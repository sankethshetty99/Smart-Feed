# AI Prompt: Recreate Robinhood Smart Feed Prototype

Copy and paste everything below this line to an AI agent to recreate this project:

---

## Project Request

Build a mobile-first Robinhood Smart Feed prototype - a web application that displays personalized AI-generated news summaries for retail stock traders. The app should feel like scrolling a social media feed, but for stock market news.

## Tech Stack Requirements

- **Frontend**: React + Vite + TypeScript
- **Routing**: Wouter (lightweight)
- **State**: TanStack React Query v5
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Animations**: Framer Motion (for list transitions)

## Design System: Robinhood-Inspired

### Colors
- **Bullish/Positive**: `#00C805` (Robinhood green)
- **Bearish/Negative**: `#FF5000` (Robinhood red)
- **Neutral**: Gray
- **Background**: White (light mode) / Near-black (dark mode)
- **Cards**: Subtle shadows, clean borders

### Layout Principles
- Mobile-first (375px-428px primary target)
- Bottom navigation bar (Feed, Search, Profile tabs)
- Card-based content with generous white space
- Bold, large numbers for prices/percentages
- Minimal text - short headlines only
- Dark mode support

## Database Schema

Create these tables:

```
users:
- id (serial, primary key)
- username (text)
- risk_tolerance (text: 'low', 'medium', 'high')

stocks:
- ticker (text, primary key) 
- company_name (text)
- sector (text)
- current_price (numeric)
- day_change_percent (numeric)

user_interests:
- id (serial, primary key)
- user_id (references users)
- ticker (references stocks)
- interest_type (text: 'holding' or 'watchlist')

feed_items:
- id (serial, primary key)
- ticker (references stocks)
- summary_headline (text)
- sentiment_score (numeric: -1.0 to 1.0)
- source_count (integer)
- primary_source_name (text)
- published_at (timestamp)
```

## Pages to Build

### 1. Feed Page (Home - `/`)
The main smart feed showing personalized news cards.

Each card displays:
- Stock ticker badge (tappable, links to stock detail)
- AI-generated headline summary
- Sentiment badge (Bullish/Bearish/Neutral with color)
- Source count and primary source name
- Relative timestamp ("2h ago")
- Daily price change percentage

Feed algorithm:
1. Show news for stocks user holds first
2. Then stocks on watchlist
3. Fill remaining with trending/high-sentiment news

### 2. News Detail Page (`/news/:id`)
Expanded view when tapping a feed card:
- Full headline
- Sentiment indicator with score
- Affected stock with current price and change
- "View Sources" link
- Back navigation

### 3. Stock Detail Page (`/stocks/:ticker`)
Robinhood-style stock page:
- Large ticker and company name at top
- Current price (big, bold)
- Daily change percentage (green/red)
- Chart placeholder area
- Timeframe buttons: 1D, 1W, 1M, 3M, 1Y, ALL (horizontally scrollable on mobile)
- Key stats section
- Fixed bottom trade bar with Buy/Sell buttons (non-functional prototype)

**Important**: Hide the bottom navigation on this page since it has its own fixed footer.

### 4. Search Page (`/search`)
- Search input for stocks
- Trending stocks section
- Display matching stocks as user types

### 5. Profile Page (`/profile`)
- User info (username)
- Holdings section (stocks they own)
- Watchlist section
- Risk tolerance display

### 6. Sources Detail Page (`/news/:id/sources`)
- List of all news sources for an article
- Source names with publication info

## API Endpoints

```
GET /api/feed/:userId    - Get personalized feed
GET /api/news/:id        - Get single news item
GET /api/users/:id       - Get user profile
GET /api/stocks/:ticker  - Get stock details
POST /api/seed           - Seed database with sample data
```

## Sample Seed Data

### Stocks (create 13):
- TSLA (Tesla, Consumer Cyclical, $248.50, +3.2%)
- NVDA (NVIDIA, Technology, $875.20, -1.5%)
- AAPL (Apple, Technology, $178.35, +0.8%)
- AMZN (Amazon, Consumer Cyclical, $178.25, +1.2%)
- MSFT (Microsoft, Technology, $378.92, +2.18%)
- GOOGL (Alphabet, Technology, $141.80, +0.95%)
- META (Meta Platforms, Technology, $485.60, +1.87%)
- JPM (JPMorgan Chase, Financial Services, $195.40, +0.92%)
- V (Visa, Financial Services, $275.30, +0.45%)
- JNJ (Johnson & Johnson, Healthcare, $156.80, -0.32%)
- NFLX (Netflix, Communication Services, $485.20, +3.25%)
- AMD (AMD, Technology, $145.80, +2.45%)
- DIS (Disney, Communication Services, $112.40, -1.15%)

### Feed Items (create 13 news items):
Example headlines:
1. TSLA: "Q4 EV Deliveries Surge Past Analyst Expectations Amid Global Demand Spike" (sentiment: 0.85, sources: 12, Bloomberg)
2. NVDA: "New Export Controls Spark Uncertainty in Semiconductor Supply Chains" (sentiment: -0.4, sources: 8, Reuters)
3. AAPL: "iPhone Sales Rebound in China as New Models Gain Traction" (sentiment: 0.55, sources: 6, WSJ)
4. AMZN: "AWS Growth Accelerates on AI Infrastructure Investments" (sentiment: 0.78, sources: 10, CNBC)
5. MSFT: "Cloud Computing Revenue Surges as Enterprise AI Adoption Accelerates" (sentiment: 0.72, sources: 9, Bloomberg)

### User Interests:
Create 1 user "casual_trader_42" with holdings in TSLA, AAPL, NVDA and watchlist for MSFT, GOOGL, META

## Key Implementation Details

### Responsive Design
- Pages with bottom nav: add `pb-20` padding
- Stock detail page: add `pb-32` for trade footer, hide bottom nav
- Timeframe buttons: wrap in horizontal scroll container for mobile
- Max width container on desktop: `max-w-2xl mx-auto`

### Bottom Navigation
- Render once in App.tsx (not per-page)
- Hide on `/stocks/*` routes (stock detail has own footer)
- Fixed position with backdrop blur

### Sentiment Badge Logic
```
if (score > 0.3) → "Bullish" in green
if (score < -0.3) → "Bearish" in red  
else → "Neutral" in gray
```

### Auto-Seed on Startup
The server should check if database has correct data (13 feed items, 1 user) on startup and seed if needed. This ensures the app works immediately after deployment.

## File Structure

```
client/src/
  App.tsx                 - Routes + global BottomNav
  pages/
    Feed.tsx
    NewsDetail.tsx
    StockDetail.tsx
    Search.tsx
    Profile.tsx
    SourcesDetail.tsx
  components/
    BottomNav.tsx
    FeedCard.tsx
    SentimentBadge.tsx
    StockBadge.tsx

server/
  index.ts               - Express entry
  routes.ts              - API handlers + seed logic
  storage.ts             - Database operations
  db.ts                  - Drizzle connection

shared/
  schema.ts              - Drizzle schema + types
  routes.ts              - API route definitions
```

## Success Criteria

1. Feed loads with 7+ news cards on home page
2. Tapping a card opens news detail
3. Tapping ticker badge opens stock detail
4. Stock detail shows chart area and trade bar
5. Bottom nav switches between Feed/Search/Profile
6. Works on mobile (375px) and desktop (1200px+)
7. Dark mode toggle works
8. All pages have proper padding (no content hidden behind fixed elements)

---

End of prompt. The AI should be able to recreate the full application from this specification.
