import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
