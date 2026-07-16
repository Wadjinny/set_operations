import { createBrowserRouter } from 'react-router'
import RootLayout from './routes/root'
import Home from './routes/home'
import ErrorPage from './routes/error-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <Home /> }],
  },
])
