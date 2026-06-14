import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useRestaurant() {
  return useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const { data } = await api.getRestaurant();
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 min
  });
}