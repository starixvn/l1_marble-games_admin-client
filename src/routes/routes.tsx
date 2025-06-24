import { Route, Routes } from 'react-router'
import HomePage from '@/pages/home.page'
import LoginPage from '@/pages/login.page'
import { PrivateRoute } from '@/routes/private-route'
import OperatorsPage from '@/pages/operators.page'
import NotFoundPage from '@/pages/notfound.page'
import GameConfigsPage from '@/pages/game-configs.page'

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/operators',
    element: <OperatorsPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    public: true,
  },
  {
    path: '/game-configs/:gameId',
    element: <GameConfigsPage />,
  },
  {
    path: '/game-configs',
    element: <GameConfigsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export function RouteHandler() {
  return (
    <Routes>
      {routes.map((route) =>
        route.public ? (
          <Route key={route.path} path={route.path} element={route.element} />
        ) : (
          <Route key={route.path} path={route.path} element={<PrivateRoute>{route.element}</PrivateRoute>} />
        ),
      )}
    </Routes>
  )
}
