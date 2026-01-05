import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  riskTolerance: text("risk_tolerance").notNull(), // 'low', 'medium', 'high'
});

export const stocks = pgTable("stocks", {
  ticker: text("ticker").primaryKey(),
  companyName: text("company_name").notNull(),
  sector: text("sector").notNull(),
  currentPrice: real("current_price").notNull(),
  dayChangePercent: real("day_change_percent").notNull(),
});

export const userInterests = pgTable("user_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ticker: text("ticker").notNull(),
  interestType: text("interest_type").notNull(), // 'holding', 'watchlist'
});

export const feedItems = pgTable("feed_items", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  summaryHeadline: text("summary_headline").notNull(),
  sentimentScore: real("sentiment_score").notNull(), // -1.0 to 1.0
  sourceCount: integer("source_count").notNull(),
  primarySourceName: text("primary_source_name").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

// Relations
export const userInterestsRelations = relations(userInterests, ({ one }) => ({
  user: one(users, {
    fields: [userInterests.userId],
    references: [users.id],
  }),
  stock: one(stocks, {
    fields: [userInterests.ticker],
    references: [stocks.ticker],
  }),
}));

export const feedItemsRelations = relations(feedItems, ({ one }) => ({
  stock: one(stocks, {
    fields: [feedItems.ticker],
    references: [stocks.ticker],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertStockSchema = createInsertSchema(stocks);
export const insertUserInterestSchema = createInsertSchema(userInterests).omit({ id: true });
export const insertFeedItemSchema = createInsertSchema(feedItems).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type Stock = typeof stocks.$inferSelect;
export type UserInterest = typeof userInterests.$inferSelect;
export type FeedItem = typeof feedItems.$inferSelect;
