import { db } from "./db";
import {
  users, stocks, userInterests, feedItems,
  type User, type Stock, type UserInterest, type FeedItem
} from "@shared/schema";
import { eq, inArray, desc, gt } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getSmartFeed(userId: number): Promise<(FeedItem & { stock: Stock })[]>;
  // Seeding methods
  createUser(user: typeof users.$inferInsert): Promise<User>;
  createStock(stock: typeof stocks.$inferInsert): Promise<Stock>;
  createUserInterest(interest: typeof userInterests.$inferInsert): Promise<UserInterest>;
  createFeedItem(item: typeof feedItems.$inferInsert): Promise<FeedItem>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
      return await db.select().from(users);
  }

  async getSmartFeed(userId: number): Promise<(FeedItem & { stock: Stock })[]> {
    // 1. Fetch user_interests
    const interests = await db.select().from(userInterests).where(eq(userInterests.userId, userId));
    const interestedTickers = interests.map(i => i.ticker);

    let items: (FeedItem & { stock: Stock })[] = [];

    if (interestedTickers.length > 0) {
      // 2. Query feed_items where ticker matches interests
      const interestItems = await db
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
        .innerJoin(stocks, eq(feedItems.ticker, stocks.ticker))
        .where(inArray(feedItems.ticker, interestedTickers))
        .orderBy(desc(feedItems.publishedAt));
      
      items = interestItems;
    }

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
        .innerJoin(stocks, eq(feedItems.ticker, stocks.ticker))
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

  async createUser(user: typeof users.$inferInsert): Promise<User> {
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
    const [newInterest] = await db.insert(userInterests).values(interest).returning();
    return newInterest;
  }

  async createFeedItem(item: typeof feedItems.$inferInsert): Promise<FeedItem> {
    const [newItem] = await db.insert(feedItems).values(item).returning();
    return newItem;
  }
}

export const storage = new DatabaseStorage();
