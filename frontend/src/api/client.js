import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

export async function signup(payload) {
  const { data } = await client.post('/auth/signup', payload);
  return data;
}

export async function login(payload) {
  const { data } = await client.post('/auth/login', payload);
  return data;
}

export function extractError(err) {
  return err?.response?.data?.message || 'Something went wrong. Please try again.';
}

export default client;
