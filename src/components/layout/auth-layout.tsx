import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <main className='min-h-screen bg-gray-200 flex flex-col gap-4 items-center justify-center p-4'>
      <Outlet />
    </main>
  )
}

export default AuthLayout
