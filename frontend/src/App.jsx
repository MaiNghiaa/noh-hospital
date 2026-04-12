import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
