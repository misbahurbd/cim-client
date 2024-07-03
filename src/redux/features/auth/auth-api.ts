import { baseApi } from '@/redux/api/baseApi'

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: builder.query({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'GET',
        credentials: true,
      }),
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation, useLazyRefreshTokenQuery } = authApi
