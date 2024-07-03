import BuyerDashboard from '@/components/buyer-dashboard'
import SellerDashboard from '@/components/seller-dashboard'
import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom'

const HomePage = () => {
  const token = useAppSelector(selectCurrentToken)
  if (!token) {
    return <Navigate to='/login' />
  }

  const user = jwtDecode(token) as JwtPayload

  if (user.role == 'seller') {
    return <SellerDashboard />
  } else {
    return <BuyerDashboard />
  }
}

export default HomePage
