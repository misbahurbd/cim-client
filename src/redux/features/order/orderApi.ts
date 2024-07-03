import { getQueryParams } from '@/lib/utils'
import { baseApi } from '@/redux/api/baseApi'

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders/create',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['orders', 'products', 'coupons'],
    }),

    sellerOrderHistory: builder.query({
      query: ({ userId, query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: `orders/history/${userId}`,
          method: 'GET',
          params,
        }
      },
      providesTags: ['orders'],
    }),

    buyerOrderHistory: builder.query({
      query: ({ userId, query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: `orders/buyerHistory/${userId}`,
          method: 'GET',
          params,
        }
      },
      providesTags: ['orders'],
    }),

    getTopProducts: builder.query({
      query: ({ userId, query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: `/orders/top-products/${userId}`,
          method: 'GET',
          params,
        }
      },
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useBuyerOrderHistoryQuery,
  useSellerOrderHistoryQuery,
  useGetTopProductsQuery,
} = orderApi
