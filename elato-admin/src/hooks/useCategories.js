import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.getCategories();
      return data;
    },
  });
}

export function useCategoryMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["categories"] });

  const create = useMutation({ mutationFn: api.createCategory, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateCategory(id, data),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: invalidate,
  });
  const reorder = useMutation({
    mutationFn: api.reorderCategories,
    onSuccess: invalidate,
  });

  return { create, update, remove, reorder };
}