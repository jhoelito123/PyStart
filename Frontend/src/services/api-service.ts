import axios from 'axios';
import { API_URL } from '../config/api-config';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const getData = async (endpoint: string) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const putData = async (endpoint: string, data: object) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(JSON.stringify(error.response.data));
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido en la petición PUT');
    }
  }
};
