import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AuthRoutes = () => {
  const location = useLocation()
  const token = useAppSelector(selectCurrentToken)

  return token ? (
    <Navigate
      to='/'
      state={{ from: location }}
      replace
    />
  ) : (
    <Outlet />
  )
}

export default AuthRoutes
