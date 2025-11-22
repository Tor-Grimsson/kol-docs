import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { applyTheme, getInitialTheme } from './hooks/useTheme'

const initialTheme = getInitialTheme()
applyTheme(initialTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
