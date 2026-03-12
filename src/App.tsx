import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/presentation/layouts/AppLayout'
import HomePage from '@/presentation/pages/HomePage'
import LearnPage from '@/presentation/pages/LearnPage'
import ScriptPage from '@/presentation/pages/ScriptPage'
import RecordPage from '@/presentation/pages/RecordPage'
import NotionTestPage from '@/presentation/pages/NotionTestPage'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/learn', element: <LearnPage /> },
      { path: '/script', element: <ScriptPage /> },
      { path: '/record', element: <RecordPage /> },
    ],
  },
  { path: '/notion-test', element: <NotionTestPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
