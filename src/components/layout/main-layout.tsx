import { selectCurrentToken } from '@/redux/features/auth/auth-slice'
import { useAppSelector } from '@/redux/hooks'
import { jwtDecode } from 'jwt-decode'
import { Outlet } from 'react-router-dom'
import Header from '@/components/header'
import { JwtPayload } from 'jsonwebtoken'
import Footer from '@/components/footer'

const MainLayout = () => {
  const token = useAppSelector(selectCurrentToken)
  if (!token) {
    return null
  }
  const { role } = jwtDecode(token) as JwtPayload

  return (
    <div className='pt-12 min-h-screen flex flex-col'>
      <Header role={role} />
      <main className='px-4 py-3 space-y-4 grow flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
