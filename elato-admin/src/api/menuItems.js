import client from "./client";

export const getItemsByCategory = (categoryId) =>
  client.get(`/items/category/${categoryId}`);

export const createItem = (data) =>
  client.post("/items/", data);

export const updateItem = (id, data) =>
  client.put(`/items/${id}`, data);

export const deleteItem = (id) =>
  client.delete(`/items/${id}`);

export const reorderItems = (order) =>
  client.patch("/items/reorder", { order });