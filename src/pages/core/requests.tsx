import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom'
import BuyerRequestsPage from '@/pages/core/buyer-requests'
import SellerRequestsPage from '@/pages/core/seller-requests'

const RequestsPage = () => {
  const token = useAppSelector(selectCurrentToken)
  if (!token) {
    return <Navigate to='/login' />
  }

  const user = jwtDecode(token) as JwtPayload

  if (user.role == 'seller') {
    return <SellerRequestsPage />
  } else {
    return <BuyerRequestsPage />
  }
}

export default RequestsPage
