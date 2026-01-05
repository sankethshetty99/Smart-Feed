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
    const users = await storage.getUsers();
    if (users.length === 0) {
      console.log("Database empty, seeding with initial data...");
      await seedDatabase();
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.error("Error checking/seeding database:", error);
  }
}

async function seedDatabase() {
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

    // 4. Feed Items
    await storage.createFeedItem({
        ticker: "TSLA",
        summaryHeadline: "Tesla beats delivery estimates in Q4, signaling strong EV demand.",
        sentimentScore: 0.85,
        sourceCount: 12,
        primarySourceName: "Bloomberg",
        publishedAt: new Date()
    });

    await storage.createFeedItem({
        ticker: "NVDA",
        summaryHeadline: "NVIDIA faces new export restrictions, causing slight market jitter.",
        sentimentScore: -0.4,
        sourceCount: 8,
        primarySourceName: "Reuters",
        publishedAt: new Date(Date.now() - 3600000) // 1 hour ago
    });

    await storage.createFeedItem({
        ticker: "AAPL",
        summaryHeadline: "Apple Vision Pro initial reviews are mixed, focusing on weight and battery.",
        sentimentScore: 0.1,
        sourceCount: 25,
        primarySourceName: "The Verge",
        publishedAt: new Date(Date.now() - 7200000) // 2 hours ago
    });
}
