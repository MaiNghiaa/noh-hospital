import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </AuthProvider>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
