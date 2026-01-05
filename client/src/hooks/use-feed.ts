import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Hook to fetch the feed for a specific user
export function useFeed(userId: number) {
  return useQuery({
    queryKey: [api.feed.get.path, userId],
    queryFn: async () => {
      const url = buildUrl(api.feed.get.path, { userId });
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Feed not found");
        }
        throw new Error("Failed to fetch feed");
      }
      
      // Parse with the response schema from routes
      return api.feed.get.responses[200].parse(await res.json());
    },
    // Refresh every 30 seconds for live-ish data
    refetchInterval: 30000, 
  });
}
