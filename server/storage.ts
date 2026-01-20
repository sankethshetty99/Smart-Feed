import { db } from "./db";
import {
  users, stocks, userInterests, feedItems, strategies,
  type User, type Stock, type UserInterest, type FeedItem, type Strategy
} from "@shared/schema";
import { eq, inArray, desc, gt, isNull, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getSmartFeed(userId: number): Promise<(FeedItem & { stock: Stock | null })[]>;
  getFeedItem(id: number): Promise<(FeedItem & { stock: Stock | null }) | undefined>;
  getAllFeedItems(): Promise<FeedItem[]>;
  clearAll(): Promise<void>;
  // Seeding methods
  createUser(user: typeof users.$inferInsert): Promise<User>;
  createStock(stock: typeof stocks.$inferInsert): Promise<Stock>;
  createUserInterest(interest: typeof userInterests.$inferInsert): Promise<UserInterest>;
  createFeedItem(item: typeof feedItems.$inferInsert): Promise<FeedItem>;
  // Strategy methods
  createStrategy(strategy: typeof strategies.$inferInsert): Promise<Strategy>;
  getStrategies(): Promise<Strategy[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getSmartFeed(userId: number): Promise<(FeedItem & { stock: Stock | null })[]> {
    // 1. Fetch user_interests
    const interests = await db.select().from(userInterests).where(eq(userInterests.userId, userId));
    const interestedTickers = interests.map(i => i.ticker);

    let items: (FeedItem & { stock: Stock | null })[] = [];

    // 2. Query feed_items: either matching interests OR general news (null ticker)
    // We use leftJoin so stock can be null
    const whereClause = interestedTickers.length > 0
      ? or(inArray(feedItems.ticker, interestedTickers), isNull(feedItems.ticker))
      : isNull(feedItems.ticker);

    const feedResults = await db
      .select({
        id: feedItems.id,
        ticker: feedItems.ticker,
        summaryHeadline: feedItems.summaryHeadline,
        sentimentScore: feedItems.sentimentScore,
        sourceCount: feedItems.sourceCount,
        primarySourceName: feedItems.primarySourceName,
        publishedAt: feedItems.publishedAt,
        stock: stocks
      })
      .from(feedItems)
      .leftJoin(stocks, eq(feedItems.ticker, stocks.ticker))
      .where(whereClause)
      .orderBy(desc(feedItems.publishedAt));

    items = feedResults;

    // 4. Fallback: If < 5 items, append 'Trending' items (high sentiment score)
    if (items.length < 5) {
      const trendingItems = await db
        .select({
          id: feedItems.id,
          ticker: feedItems.ticker,
          summaryHeadline: feedItems.summaryHeadline,
          sentimentScore: feedItems.sentimentScore,
          sourceCount: feedItems.sourceCount,
          primarySourceName: feedItems.primarySourceName,
          publishedAt: feedItems.publishedAt,
          stock: stocks
        })
        .from(feedItems)
        .leftJoin(stocks, eq(feedItems.ticker, stocks.ticker))
        .where(gt(feedItems.sentimentScore, 0.5)) // Simple trending logic
        .orderBy(desc(feedItems.publishedAt))
        .limit(10); // Limit to avoid too many

      // Merge avoiding duplicates
      const existingIds = new Set(items.map(i => i.id));
      for (const item of trendingItems) {
        if (!existingIds.has(item.id)) {
          items.push(item);
          existingIds.add(item.id);
        }
      }
    }

    return items;
  }

  async getFeedItem(id: number): Promise<(FeedItem & { stock: Stock | null }) | undefined> {
    const [item] = await db
      .select({
        id: feedItems.id,
        ticker: feedItems.ticker,
        summaryHeadline: feedItems.summaryHeadline,
        sentimentScore: feedItems.sentimentScore,
        sourceCount: feedItems.sourceCount,
        primarySourceName: feedItems.primarySourceName,
        publishedAt: feedItems.publishedAt,
        stock: stocks
      })
      .from(feedItems)
      .leftJoin(stocks, eq(feedItems.ticker, stocks.ticker))
      .where(eq(feedItems.id, id));
    return item;
  }

  async createUser(user: typeof users.$inferInsert): Promise<User> {
    const [existing] = await db.select().from(users).where(eq(users.username, user.username));
    if (existing) {
      return existing;
    }
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createStock(stock: typeof stocks.$inferInsert): Promise<Stock> {
    const [newStock] = await db.insert(stocks).values(stock).onConflictDoNothing().returning();
    if (!newStock) {
      // Return existing if conflict
      const [existing] = await db.select().from(stocks).where(eq(stocks.ticker, stock.ticker));
      return existing;
    }
    return newStock;
  }

  async createUserInterest(interest: typeof userInterests.$inferInsert): Promise<UserInterest> {
    const existing = await db.select().from(userInterests)
      .where(eq(userInterests.userId, interest.userId))
      .then(items => items.find(i => i.ticker === interest.ticker));
    if (existing) {
      return existing;
    }
    const [newInterest] = await db.insert(userInterests).values(interest).returning();
    return newInterest;
  }

  async createFeedItem(item: typeof feedItems.$inferInsert): Promise<FeedItem> {
    const tickerCheck = item.ticker
      ? eq(feedItems.ticker, item.ticker)
      : isNull(feedItems.ticker);

    const existing = await db.select().from(feedItems)
      .where(tickerCheck)
      .then(items => items.find(i => i.summaryHeadline === item.summaryHeadline));
    if (existing) {
      return existing;
    }
    const [newItem] = await db.insert(feedItems).values(item).returning();
    return newItem;
  }

  async getAllFeedItems(): Promise<FeedItem[]> {
    return await db.select().from(feedItems);
  }

  async createStrategy(strategy: typeof strategies.$inferInsert): Promise<Strategy> {
    const [newStrategy] = await db.insert(strategies).values(strategy).returning();
    return newStrategy;
  }

  async getStrategies(): Promise<Strategy[]> {
    return await db.select().from(strategies).orderBy(desc(strategies.createdAt));
  }

  async clearAll(): Promise<void> {
    await db.delete(feedItems);
    await db.delete(userInterests);
    await db.delete(stocks);
    await db.delete(users);
    await db.delete(strategies);
  }
}

export const storage = new DatabaseStorage();
