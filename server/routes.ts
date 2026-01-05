import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auto-seed database on startup if empty
  await ensureDatabaseSeeded();
  
  app.get(api.feed.get.path, async (req, res) => {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    const feed = await storage.getSmartFeed(userId);
    res.json(feed);
  });

  app.get(api.news.get.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid news ID" });
    }
    const item = await storage.getFeedItem(id);
    if (!item) {
        return res.status(404).json({ message: "News item not found" });
    }
    res.json(item);
  });

  app.get(api.users.get.path, async (req, res) => {
    const userId = Number(req.params.id);
    const user = await storage.getUser(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });
  
  app.get(api.users.list.path, async (req, res) => {
      const users = await storage.getUsers();
      res.json(users);
  });

  // Seed Data Endpoint (for convenience in prototype)
  app.post("/api/seed", async (req, res) => {
      await seedDatabase();
      res.json({ message: "Database seeded" });
  });

  return httpServer;
}

async function ensureDatabaseSeeded() {
  try {
    const allFeedItems = await storage.getAllFeedItems();
    console.log(`Found ${allFeedItems.length} feed items in database`);
    if (allFeedItems.length < 10) {
      console.log("Database empty or incomplete, clearing and reseeding...");
      try {
        await storage.clearAll();
        console.log("Cleared old data");
      } catch (clearError) {
        console.log("Clear failed (may be empty), proceeding with seed...");
      }
      await seedDatabase();
      console.log("Database seeded successfully with full data");
    } else {
      console.log("Database already has sufficient data");
    }
  } catch (error) {
    console.error("Error checking/seeding database:", error);
    // Try to seed anyway if check failed
    try {
      console.log("Attempting to seed despite error...");
      await seedDatabase();
      console.log("Fallback seed completed");
    } catch (seedError) {
      console.error("Fallback seed also failed:", seedError);
    }
  }
}

async function seedDatabase() {
    // 1. Create Users
    const user = await storage.createUser({
        username: "casual_trader_42",
        riskTolerance: "medium"
    });

    // 2. Create Stocks
    await storage.createStock({
        ticker: "TSLA",
        companyName: "Tesla, Inc.",
        sector: "Consumer Cyclical",
        currentPrice: 248.50,
        dayChangePercent: 3.2
    });

    await storage.createStock({
        ticker: "NVDA",
        companyName: "NVIDIA Corp.",
        sector: "Technology",
        currentPrice: 875.20,
        dayChangePercent: -1.5
    });

    await storage.createStock({
        ticker: "AAPL",
        companyName: "Apple Inc.",
        sector: "Technology",
        currentPrice: 178.35,
        dayChangePercent: 0.8
    });

    await storage.createStock({
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        sector: "Technology",
        currentPrice: 142.85,
        dayChangePercent: 1.45
    });

    await storage.createStock({
        ticker: "MSFT",
        companyName: "Microsoft Corp.",
        sector: "Technology",
        currentPrice: 378.92,
        dayChangePercent: 2.18
    });

    await storage.createStock({
        ticker: "AMZN",
        companyName: "Amazon.com Inc.",
        sector: "Consumer Cyclical",
        currentPrice: 178.25,
        dayChangePercent: -1.32
    });

    await storage.createStock({
        ticker: "META",
        companyName: "Meta Platforms Inc.",
        sector: "Technology",
        currentPrice: 485.60,
        dayChangePercent: 1.87
    });

    await storage.createStock({
        ticker: "JPM",
        companyName: "JPMorgan Chase & Co.",
        sector: "Financial Services",
        currentPrice: 195.40,
        dayChangePercent: 0.92
    });

    await storage.createStock({
        ticker: "XOM",
        companyName: "Exxon Mobil Corp.",
        sector: "Energy",
        currentPrice: 108.75,
        dayChangePercent: -0.65
    });

    await storage.createStock({
        ticker: "DIS",
        companyName: "The Walt Disney Co.",
        sector: "Communication Services",
        currentPrice: 112.30,
        dayChangePercent: -0.78
    });

    await storage.createStock({
        ticker: "NFLX",
        companyName: "Netflix Inc.",
        sector: "Communication Services",
        currentPrice: 485.20,
        dayChangePercent: 3.25
    });

    await storage.createStock({
        ticker: "AMD",
        companyName: "Advanced Micro Devices",
        sector: "Technology",
        currentPrice: 145.80,
        dayChangePercent: 2.45
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

    await storage.createUserInterest({
        userId: user.id,
        ticker: "MSFT",
        interestType: "holding"
    });

    await storage.createUserInterest({
        userId: user.id,
        ticker: "META",
        interestType: "watchlist"
    });

    await storage.createUserInterest({
        userId: user.id,
        ticker: "JPM",
        interestType: "holding"
    });

    await storage.createUserInterest({
        userId: user.id,
        ticker: "NFLX",
        interestType: "watchlist"
    });

    await storage.createUserInterest({
        userId: user.id,
        ticker: "AMD",
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
        publishedAt: new Date(Date.now() - 3600000)
    });

    await storage.createFeedItem({
        ticker: "AAPL",
        summaryHeadline: "Mixed Reception for Next-Gen Wearables Signals Evolving Consumer Preferences",
        sentimentScore: 0.1,
        sourceCount: 25,
        primarySourceName: "The Verge",
        publishedAt: new Date(Date.now() - 7200000)
    });

    await storage.createFeedItem({
        ticker: "GOOGL",
        summaryHeadline: "AI Integration Across Search Products Drives User Engagement Metrics Higher",
        sentimentScore: 0.62,
        sourceCount: 15,
        primarySourceName: "TechCrunch",
        publishedAt: new Date(Date.now() - 10800000)
    });

    await storage.createFeedItem({
        ticker: "MSFT",
        summaryHeadline: "Cloud Computing Revenue Surges as Enterprise AI Adoption Accelerates",
        sentimentScore: 0.72,
        sourceCount: 9,
        primarySourceName: "Bloomberg",
        publishedAt: new Date(Date.now() - 14400000)
    });

    await storage.createFeedItem({
        ticker: "AMZN",
        summaryHeadline: "E-Commerce Giant Faces Headwinds as Consumer Spending Patterns Shift",
        sentimentScore: -0.25,
        sourceCount: 11,
        primarySourceName: "WSJ",
        publishedAt: new Date(Date.now() - 18000000)
    });

    await storage.createFeedItem({
        ticker: "META",
        summaryHeadline: "Social Media Engagement Metrics Show Surprising Q4 Rebound",
        sentimentScore: 0.65,
        sourceCount: 7,
        primarySourceName: "CNBC",
        publishedAt: new Date(Date.now() - 21600000)
    });

    await storage.createFeedItem({
        ticker: "JPM",
        summaryHeadline: "Banking Sector Rallies on Stronger-Than-Expected Loan Growth Data",
        sentimentScore: 0.58,
        sourceCount: 14,
        primarySourceName: "Bloomberg",
        publishedAt: new Date(Date.now() - 25200000)
    });

    await storage.createFeedItem({
        ticker: "XOM",
        summaryHeadline: "Energy Sector Volatility Continues as Oil Prices React to OPEC Signals",
        sentimentScore: -0.15,
        sourceCount: 18,
        primarySourceName: "Reuters",
        publishedAt: new Date(Date.now() - 28800000)
    });

    await storage.createFeedItem({
        ticker: "DIS",
        summaryHeadline: "Streaming Wars Intensify as Content Investments Face Profitability Scrutiny",
        sentimentScore: -0.3,
        sourceCount: 20,
        primarySourceName: "Variety",
        publishedAt: new Date(Date.now() - 32400000)
    });

    await storage.createFeedItem({
        ticker: "NFLX",
        summaryHeadline: "Password Sharing Crackdown Yields Better-Than-Expected Subscriber Growth",
        sentimentScore: 0.78,
        sourceCount: 12,
        primarySourceName: "Bloomberg",
        publishedAt: new Date(Date.now() - 36000000)
    });

    await storage.createFeedItem({
        ticker: "AMD",
        summaryHeadline: "Chip Demand Outlook Brightens as Data Center Spending Rebounds",
        sentimentScore: 0.68,
        sourceCount: 10,
        primarySourceName: "Reuters",
        publishedAt: new Date(Date.now() - 39600000)
    });
}
