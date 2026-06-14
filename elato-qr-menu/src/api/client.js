import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const RESTAURANT_SLUG = import.meta.env.VITE_RESTAURANT_SLUG || "elato-celebre";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const api = {
  getRestaurant: () => client.get(`/restaurants/${RESTAURANT_SLUG}`),
  getHeroSlides: () => client.get(`/hero/${RESTAURANT_SLUG}`),
  getCategories: () =>
    client.get(`/categories/${RESTAURANT_SLUG}?include_items=true`),
};

export default client;