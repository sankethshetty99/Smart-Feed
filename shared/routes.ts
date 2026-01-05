import { z } from 'zod';
import { insertUserSchema, insertStockSchema, insertUserInterestSchema, insertFeedItemSchema, users, stocks, userInterests, feedItems } from './schema';

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  serverError: z.object({ message: z.string() }),
};

// Response schema for Feed Item joined with Stock
const feedItemWithStockSchema = z.object({
  id: z.number(),
  ticker: z.string(),
  summaryHeadline: z.string(),
  sentimentScore: z.number(),
  sourceCount: z.number(),
  primarySourceName: z.string(),
  publishedAt: z.string().or(z.date()),
  stock: z.object({
    ticker: z.string(),
    companyName: z.string(),
    sector: z.string(),
    currentPrice: z.number(),
    dayChangePercent: z.number(),
  })
});

export const api = {
  feed: {
    get: {
      method: 'GET' as const,
      path: '/api/feed/:userId',
      responses: {
        200: z.array(feedItemWithStockSchema),
        404: errorSchemas.notFound,
      },
    },
  },
  users: {
    get: {
      method: 'GET' as const,
      path: '/api/users/:id',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
        method: 'GET' as const,
        path: '/api/users',
        responses: {
            200: z.array(z.custom<typeof users.$inferSelect>()),
        }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
