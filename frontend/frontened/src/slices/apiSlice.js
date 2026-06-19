import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // 🔥 IMPORTANT (sends cookie automatically)
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: () => ({}),
});