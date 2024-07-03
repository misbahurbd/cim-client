import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoutes = () => {
  const location = useLocation()
  const token = useAppSelector(selectCurrentToken)

  return token ? (
    <Outlet />
  ) : (
    <Navigate
      to='/login'
      state={{ from: location }}
      replace
    />
  )
}

export default ProtectedRoutes
