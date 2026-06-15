import client from "./client";

const SLUG = import.meta.env.VITE_RESTAURANT_SLUG;

export const getHeroSlides = () =>
  client.get(`/hero/${SLUG}`);

export const addSlide = (image_url) =>
  client.post("/hero/", { image_url });

export const deleteSlide = (id) =>
  client.delete(`/hero/${id}`);

export const reorderSlides = (order) =>
  client.patch("/hero/reorder", { order });