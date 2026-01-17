import { storage } from "./storage";

async function seed() {
    console.log("Seeding database...");

    // Check if user exists
    const users = await storage.getUsers();
    if (users.length > 0) {
        console.log("Database already seeded");
        process.exit(0);
    }

    // 1. Create Users
    const user = await storage.createUser({
        username: "casual_trader_42",
        riskTolerance: "medium"
    });

    // 2. Create Stocks
    const tsla = await storage.createStock({
        ticker: "TSLA",
        companyName: "Tesla, Inc.",
        sector: "Consumer Cyclical",
        currentPrice: 248.50,
        dayChangePercent: 3.2
    });

    const nvda = await storage.createStock({
        ticker: "NVDA",
        companyName: "NVIDIA Corp.",
        sector: "Technology",
        currentPrice: 875.20,
        dayChangePercent: -1.5
    });

    const aapl = await storage.createStock({
        ticker: "AAPL",
        companyName: "Apple Inc.",
        sector: "Technology",
        currentPrice: 178.35,
        dayChangePercent: 0.8
    });

    // 3. User Interests
    await storage.createUserInterest({
        userId: user.id,
        ticker: "TSLA",
        interestType: "holding"
    });

    await storage.createUserInterest({
        userId: user.id,
        ticker: "NVDA",
        interestType: "watchlist"
    });

    // 4. Feed Items - AI-styled event-focused headlines
    await storage.createFeedItem({
        ticker: "TSLA",
        summaryHeadline: "Q4 EV Deliveries Surge Past Analyst Expectations Amid Global Demand Spike",
        sentimentScore: 0.85,
        sourceCount: 12,
        primarySourceName: "Bloomberg",
        publishedAt: new Date()
    });

    await storage.createFeedItem({
        ticker: "NVDA",
        summaryHeadline: "New Export Controls Spark Uncertainty in Semiconductor Supply Chains",
        sentimentScore: -0.4,
        sourceCount: 8,
        primarySourceName: "Reuters",
        publishedAt: new Date(Date.now() - 3600000) // 1 hour ago
    });

    await storage.createFeedItem({
        ticker: "AAPL",
        summaryHeadline: "Mixed Reception for Next-Gen Wearables Signals Evolving Consumer Preferences",
        sentimentScore: 0.1,
        sourceCount: 25,
        primarySourceName: "The Verge",
        publishedAt: new Date(Date.now() - 7200000) // 2 hours ago
    });

    // 5. General World Events (No Specific Ticker)
    await storage.createFeedItem({
        ticker: null,
        summaryHeadline: "Global Markets Rally as Inflation Data Shows Cooling Trend",
        sentimentScore: 0.75,
        sourceCount: 30,
        primarySourceName: "Financial Times",
        publishedAt: new Date(Date.now() - 1000000)
    });

    await storage.createFeedItem({
        ticker: null,
        summaryHeadline: "New International Trade Agreements Boost Cross-Border Commerce Outlook",
        sentimentScore: 0.60,
        sourceCount: 15,
        primarySourceName: "Reuters",
        publishedAt: new Date(Date.now() - 5000000)
    });

    await storage.createFeedItem({
        ticker: null,
        summaryHeadline: "Tech Sector Regulations Tighten Across Major Economies",
        sentimentScore: -0.35,
        sourceCount: 22,
        primarySourceName: "WSJ",
        publishedAt: new Date(Date.now() - 8000000)
    });
    console.log("Seeding complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
