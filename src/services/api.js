import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getOffers = () => api.get('/offers');
export const createOffer = (offerData) => api.post('/offers', offerData);

// Add more API calls as needed
