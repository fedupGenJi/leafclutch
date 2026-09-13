import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('leaftech_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function signup(payload) {
  const { data } = await client.post('/auth/signup', payload);
  return data;
}

export async function login(payload) {
  const { data } = await client.post('/auth/login', payload);
  return data;
}

export async function initiateKhaltiPayment({ course, price }) {
  const { data } = await client.post('/payment/khalti/initiate', { course, price });
  return data; // { payment_url, pidx }
}

export async function verifyKhaltiPayment(pidx) {
  const { data } = await client.post('/payment/verify', { pidx });
  return data; // { success, status, course, message }
}

export function extractError(err) {
  return err?.response?.data?.message || 'Something went wrong. Please try again.';
}

export default client;