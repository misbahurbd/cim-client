import { getQueryParams } from '@/lib/utils'
import { baseApi } from '@/redux/api/baseApi'

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // upload product image
    upload: builder.mutation({
      query: (file) => ({
        url: '/products/upload',
        method: 'POST',
        body: file,
      }),
    }),

    // add new product
    addProduct: builder.mutation({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['products'],
    }),

    // get current user products
    getCurrentUserProducts: builder.query({
      query: ({ userId, query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: `/products/all/${userId}`,
          method: 'GET',
          params: params,
        }
      },
      providesTags: ['products'],
    }),

    // get all products
    getProducts: builder.query({
      query: ({ query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: '/products',
          method: 'GET',
          params: params,
        }
      },
      providesTags: ['products'],
    }),

    // get single product
    getProduct: builder.query({
      query: ({ productId }) => ({
        url: `/products/${productId}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),

    // get related product
    getRelatedProduct: builder.query({
      query: ({ productId }) => ({
        url: `/products/related/${productId}`,
        method: 'GET',
      }),
      providesTags: ['products'],
    }),

    // get top selling product
    getTopSellingProduct: builder.query({
      query: () => ({
        url: '/products/top-selling',
        method: 'GET',
      }),
      providesTags: ['products'],
    }),

    // update existed products
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `/products/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['products'],
    }),

    // delete multiple products
    deleteProducts: builder.mutation({
      query: (ids) => {
        return {
          url: '/products/delete',
          method: 'PUT',
          body: { ids },
        }
      },
      invalidatesTags: ['products'],
    }),

    // delete single product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products'],
    }),
  }),
})

export const {
  useUploadMutation,
  useAddProductMutation,
  useGetCurrentUserProductsQuery,
  useGetTopSellingProductQuery,
  useGetRelatedProductQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductsMutation,
  useDeleteProductMutation,
} = productApi
