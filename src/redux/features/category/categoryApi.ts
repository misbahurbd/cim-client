import { baseApi } from '@/redux/api/baseApi'

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['categories'],
    }),
    getAllCategory: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['categories'],
    }),
  }),
})

export const { useCreateCategoryMutation, useGetAllCategoryQuery } = categoryApi
