import { RootState } from '@/redux/store'
import { createSlice } from '@reduxjs/toolkit'
import { JwtPayload } from 'jsonwebtoken'

const initialState: { user: null | JwtPayload; token: null | string } = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload
      state.user = user
      state.token = accessToken
    },
    logOut: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export default authSlice.reducer

export const { setCredentials, logOut } = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectCurrentToken = (state: RootState) => state.auth.token
