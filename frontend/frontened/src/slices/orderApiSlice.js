import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // CREATE ORDER
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),

    // GET ORDER DETAILS
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // PAY ORDER
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),

    // PAYPAL CLIENT ID
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    // MY ORDERS
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    // ALL ORDERS (admin)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    // DELIVER ORDER (admin)
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = orderApiSlice;