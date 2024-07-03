import BuyerPurchaseHistory from '@/components/buyer-purchase-history'
import SellerOrderHistory from '@/components/seller-order-history'
import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import { Navigate } from 'react-router-dom'

const OrdersPage = () => {
  const token = useAppSelector(selectCurrentToken)
  if (!token) {
    return <Navigate to='/login' />
  }

  const user = jwtDecode(token) as JwtPayload

  if (user.role == 'seller') {
    return <SellerOrderHistory />
  } else {
    return <BuyerPurchaseHistory />
  }
}

export default OrdersPage
