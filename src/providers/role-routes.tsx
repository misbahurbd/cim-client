import { logOut, selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface RoleRoutesProps {
  role: ('seller' | 'buyer')[]
}

const RoleRoutes: React.FC<RoleRoutesProps> = ({ role }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const token = useAppSelector(selectCurrentToken)

  const pushLogout = () => {
    dispatch(logOut())
    return (
      <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />
    )
  }

  if (!token) return pushLogout()

  const user = jwtDecode(token) as JwtPayload
  if (role && !role.includes(user.role)) return pushLogout()

  return <Outlet />
}

export default RoleRoutes
