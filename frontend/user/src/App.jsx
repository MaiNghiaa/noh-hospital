import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
