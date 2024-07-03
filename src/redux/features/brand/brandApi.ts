import { baseApi } from '@/redux/api/baseApi'

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (brandData) => ({
        url: '/brands',
        method: 'POST',
        body: brandData,
      }),
      invalidatesTags: ['brands'],
    }),
    getAllBrand: builder.query({
      query: () => ({
        url: '/brands',
        method: 'GET',
      }),
      providesTags: ['brands'],
    }),
  }),
})

export const { useCreateBrandMutation, useGetAllBrandQuery } = brandApi
