import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // =========================
    // GET ALL PRODUCTS
    // =========================
    getProducts: builder.query({
      query: ({ keyword = '', pageNumber = 1 } = {}) =>
        `${PRODUCTS_URL}?keyword=${keyword}&pageNumber=${pageNumber}`,

      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map((product) => ({
                type: 'Product',
                id: product._id,
              })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],

      keepUnusedDataFor: 5,
    }),

    // =========================
    // GET PRODUCT DETAILS
    // =========================
    getProductDetails: builder.query({
      query: (productId) => `${PRODUCTS_URL}/${productId}`,

      providesTags: (result, error, id) => [
        { type: 'Product', id },
      ],
    }),

    // =========================
    // TOP RATED PRODUCTS ⭐
    // =========================
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,

      providesTags: [{ type: 'Product', id: 'TOP' }],

      keepUnusedDataFor: 5,
    }),

    // =========================
    // CREATE PRODUCT
    // =========================
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: data,
      }),

      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // =========================
    // DELETE PRODUCT
    // =========================
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),

      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // =========================
    // UPDATE PRODUCT
    // =========================
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),

      invalidatesTags: (result, error, data) => [
        { type: 'Product', id: data.productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // =========================
    // CREATE REVIEW
    // =========================
    createReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),

      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

  }),
});

// =========================
// EXPORT HOOKS
// =========================
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetTopProductsQuery, // ⭐ TOP PRODUCTS HOOK
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateReviewMutation,
} = productApiSlice;