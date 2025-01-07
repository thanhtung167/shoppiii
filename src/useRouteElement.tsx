import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Resgiter'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout/MainLayout.tsx'
import { lazy, Suspense, useContext } from 'react'
import { AppContext } from './contexts/app.context.tsx'
import path from './constants/path.ts'
import UserLayout from './pages/User/layout/UserLayout'
import ChangePassword from './pages/User/pages/ChangePassword'
import HistoryPurchase from './pages/User/pages/HistoryPurchase'

const ProductDetail = lazy(()=> import('./pages/ProductDetail'))
const ProductList = lazy(()=> import('./pages/ProductList'))
const NotFound = lazy(()=> import('./pages/NotFound'))
const Cart = lazy(()=> import('./pages/Cart'))
const CartLayout = lazy(()=> import('./layouts/CartLayout'))
const Profile = lazy(()=> import('./pages/User/pages/Profile'))

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedRoute() {
  const { isAuthenticate } = useContext(AppContext)
  return isAuthenticate ? <Outlet></Outlet> : <Navigate to={path.login}></Navigate>
}
// eslint-disable-next-line react-refresh/only-export-components
function UnProtectedRoute() {
  const { isAuthenticate } = useContext(AppContext)
  return !isAuthenticate ? <Outlet></Outlet> : <Navigate to={'/'}></Navigate>
}
export default function useRouteElement() {
  return useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute></ProtectedRoute>,
      children: [
        {
          path: path.cart,
          element: (
            <Suspense>
              <CartLayout>
                <Cart />
              </CartLayout>
            </Suspense>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout></UserLayout>
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Suspense><Profile /></Suspense>
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.purchaseHistory,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      element: <UnProtectedRoute></UnProtectedRoute>,
      children: [
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        },
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <NotFound></NotFound>
          </Suspense>
        </MainLayout>
      )
    }
  ])
}
