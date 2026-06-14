import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.getCategories();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}