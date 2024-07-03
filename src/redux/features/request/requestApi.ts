import { getQueryParams } from '@/lib/utils'
import { baseApi } from '@/redux/api/baseApi'

const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add request
    addRequest: builder.mutation({
      query: (data) => ({
        url: '/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['requests'],
    }),

    // get requests
    getBuyerRequests: builder.query({
      query: ({ userId, query }) => {
        const params = query ? getQueryParams(query) : {}

        return {
          url: `/requests/buyer/${userId}`,
          method: 'GET',
          params,
        }
      },
      providesTags: ['requests'],
    }),

    // get pending requests
    getPendingRequests: builder.query({
      query: () => ({
        url: '/requests/pending',
        method: 'GET',
      }),
      providesTags: ['requests'],
    }),

    // update request
    updateRequest: builder.mutation({
      query: (data) => ({
        url: `/requests/${data.requestId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['requests'],
    }),
  }),
})

export const {
  useAddRequestMutation,
  useUpdateRequestMutation,
  useGetBuyerRequestsQuery,
  useGetPendingRequestsQuery,
} = requestApi
