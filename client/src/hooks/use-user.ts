import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useUser(id: number) {
  return useQuery({
    queryKey: [api.users.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.users.get.path, { id });
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch user");
      }
      
      return api.users.get.responses[200].parse(await res.json());
    },
  });
}

// Helper to get all users (useful for simulating login/switching users)
export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path);
      if (!res.ok) throw new Error("Failed to fetch users list");
      return api.users.list.responses[200].parse(await res.json());
    }
  });
}
