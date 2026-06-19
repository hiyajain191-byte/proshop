import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),

    // REGISTER
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),

    // LOGOUT
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    // GET PROFILE
    getProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      providesTags: ['User'],
    }),

    // UPDATE PROFILE
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // GET ALL USERS (ADMIN)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // DELETE USER (ADMIN)
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // GET USER DETAILS (ADMIN)
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // UPDATE USER (ADMIN) ✅ FIXED HERE
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data._id}`,   // ✅ FIXED (was userId before)
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = userApiSlice;