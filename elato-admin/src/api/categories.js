import client from "./client";

const SLUG = import.meta.env.VITE_RESTAURANT_SLUG;

export const getCategories = () =>
  client.get(`/categories/${SLUG}?include_items=false`);

export const createCategory = (data) =>
  client.post("/categories/", data);

export const updateCategory = (id, data) =>
  client.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  client.delete(`/categories/${id}`);

export const reorderCategories = (order) =>
  client.patch("/categories/reorder", { order });