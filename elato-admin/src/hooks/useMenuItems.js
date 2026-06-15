import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/menuItems";

export function useMenuItems(categoryId) {
  return useQuery({
    queryKey: ["items", categoryId],
    queryFn: async () => {
      const { data } = await api.getItemsByCategory(categoryId);
      return data;
    },
    enabled: !!categoryId,
  });
}

export function useMenuItemMutations() {
  const qc = useQueryClient();
  const invalidate = (categoryId) =>
    qc.invalidateQueries({ queryKey: ["items", categoryId] });

  const create = useMutation({
    mutationFn: api.createItem,
    onSuccess: (_, vars) => invalidate(vars.category_id),
  });
  const update = useMutation({
    mutationFn: ({ id, data }) => api.updateItem(id, data),
    onSuccess: (_, vars) => invalidate(vars.data.category_id),
  });
  const remove = useMutation({
    mutationFn: ({ id }) => api.deleteItem(id),
    onSuccess: (_, vars) => invalidate(vars.category_id),
  });

  return { create, update, remove };
}