import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useHeroSlides() {
  return useQuery({
    queryKey: ["heroSlides"],
    queryFn: async () => {
      const { data } = await api.getHeroSlides();
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}