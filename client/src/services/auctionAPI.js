import axios from 'axios';

const API = axios.create({
  baseURL    : 'http://localhost:5000/api/auctions',
  withCredentials: true
});

export const auctionAPI = {
  getAll : ()            => API.get('/'),
  getOne : (id)          => API.get(`/${id}`),
  create : (formData)    => API.post('/', formData, { headers:{ 'Content-Type':'multipart/form-data' } })
};
