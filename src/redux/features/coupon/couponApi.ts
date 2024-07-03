import { getQueryParams } from '@/lib/utils'
import { baseApi } from '@/redux/api/baseApi'

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add new coupon
    addCoupon: builder.mutation({
      query: (data) => ({
        url: '/coupons',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['coupons'],
    }),

    // get all coupon
    getCoupons: builder.query({
      query: ({ userId, query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: `/coupons/${userId}`,
          method: 'GET',
          params,
        }
      },
      providesTags: ['coupons'],
    }),

    // validate coupon
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `/coupons/${data.code}`,
        method: 'PUT',
        params: {
          productId: data.productId,
        },
      }),
    }),
  }),
})

export const { useAddCouponMutation, useGetCouponsQuery, useValidateCouponMutation } = couponApi
