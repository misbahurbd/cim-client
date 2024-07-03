/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/redux/store'
import { jwtDecode } from 'jwt-decode'
import { logOut, setCredentials } from '@/redux/features/auth/auth-slice'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://cim-server-a6.vercel.app/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', token)
    }
    return headers
  },
})

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const res: any = await baseQuery('/auth/refresh-token', api, extraOptions)

    if (res?.data?.data?.accessToken) {
      // store the new token
      const user = jwtDecode(res?.data?.data?.accessToken)
      api.dispatch(
        setCredentials({
          user: user,
          accessToken: res?.data?.data?.accessToken,
        }),
      )

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['products', 'categories', 'brands', 'orders', 'coupons', 'requests'],
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
})
