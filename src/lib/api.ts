import axios from 'axios';

// Menggunakan Proxy lokal untuk menghindari CORS
const BASE_URL = '/api/proxy';

export const api = {
  getLatest: async (page = 1) => {
    const res = await axios.get(`${BASE_URL}/latest?page=${page}`);
    return res.data;
  },
  getTrending: async (page = 1) => {
    const res = await axios.get(`${BASE_URL}/trending?page=${page}`);
    return res.data;
  },
  getDubIndo: async (type: 'terpopuler' | 'terbaru' = 'terbaru', page = 1) => {
    const res = await axios.get(`${BASE_URL}/dubindo?classify=${type}&page=${page}`);
    return res.data;
  },
  search: async (query: string) => {
    const res = await axios.get(`${BASE_URL}/search?query=${query}`);
    return res.data;
  },
  getDetail: async (bookId: string) => {
    const res = await axios.get(`${BASE_URL}/detail?bookId=${bookId}`);
    return res.data;
  },
  getAllEpisodes: async (bookId: string) => {
    const res = await axios.get(`${BASE_URL}/allepisode?bookId=${bookId}`);
    return res.data;
  }
};
