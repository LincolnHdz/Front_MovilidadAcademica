import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
import ConditionalHeader from './components/ConditionalHeader.jsx'
import ConditionalFooter from './components/ConditionalFooter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <ConditionalHeader />
        <App />
        <ConditionalFooter />
      </Router>
    </AuthProvider>
  </StrictMode>,
)
