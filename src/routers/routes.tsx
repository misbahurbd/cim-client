import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/components/layout/main-layout'
import HomePage from '@/pages/core/home'
import RegisterPage from '@/pages/auth/register'
import AuthLayout from '@/components/layout/auth-layout'
import LoginPage from '@/pages/auth/login'
import ProtectedRoutes from '@/providers/protected-routes'
import AuthRoutes from '@/providers/auth-routes'
import RoleRoutes from '@/providers/role-routes'
import AddProduct from '@/pages/core/add-product'
import ProductsPage from '@/pages/core/products'
import EditProduct from '@/pages/core/edit-product'
import CreateProductVariant from '@/pages/core/variant-product'
import OrdersPage from '@/pages/core/orders'
import CouponsPage from '@/pages/core/coupons'
import ShopPage from '@/pages/core/shop'
import SingleProduct from '@/pages/core/single-product'
import RequestsPage from '@/pages/core/requests'
import AddRequestPage from '@/pages/core/add-request'
import NotFoundPage from '@/pages/core/not-found'

const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            element: <RoleRoutes role={['seller']} />,
            children: [
              {
                path: 'products',
                element: <RoleRoutes role={['seller']} />,
                children: [
                  {
                    index: true,
                    element: <ProductsPage />,
                  },
                  {
                    path: 'add-product',
                    element: <AddProduct />,
                  },
                  {
                    path: ':id/edit',
                    element: <EditProduct />,
                  },
                  {
                    path: ':id/create-variant',
                    element: <CreateProductVariant />,
                  },
                ],
              },
              {
                path: 'coupons',
                element: <CouponsPage />,
              },
            ],
          },
          {
            element: <RoleRoutes role={['buyer']} />,
            children: [
              {
                path: 'shop',
                element: <ShopPage />,
              },
              {
                path: 'shop/:productId',
                element: <SingleProduct />,
              },
            ],
          },
          {
            path: 'orders',
            element: <OrdersPage />,
          },
          {
            path: 'requests',
            children: [
              {
                index: true,
                element: <RequestsPage />,
              },
              {
                element: <RoleRoutes role={['buyer']} />,
                children: [
                  {
                    path: 'add',
                    element: <AddRequestPage />,
                  },
                ],
              },
            ],
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthRoutes />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'register',
            element: <RegisterPage />,
          },
          {
            path: 'login',
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
])

export default router
