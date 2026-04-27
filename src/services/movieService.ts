// src/services/movieService.ts
import axios from "axios";
import { type Movie, type MovieRequest } from "../types/movie";

const API_GATEWAY_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";
const API_BASE_URL = `${API_GATEWAY_URL}/api/movies`;
export const movieService = {
  getAll: async (): Promise<Movie[]> => {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  },

  getById: async (id: string): Promise<Movie> => {
    const res = await axios.get(`${API_BASE_URL}/${id}`);
    return res.data;
  },

  create: async (data: MovieRequest): Promise<Movie> => {
    const res = await axios.post(API_BASE_URL, data);
    return res.data;
  },

  update: async (id: string, data: MovieRequest): Promise<Movie> => {
    const res = await axios.put(`${API_BASE_URL}/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};
