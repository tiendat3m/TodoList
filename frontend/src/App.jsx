import { toast, Toaster } from 'sonner'
import { Route, Routes, BrowserRouter } from 'react-router'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'

function App() {

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<HomePage />}
          />
          <Route
            path='*'
            element={<NotFound />}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
