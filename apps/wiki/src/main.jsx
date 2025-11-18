import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@kol/ui/theme.css'
import '@kol/ui/css/components.css'
import '@kol/ui/css/docs.css'
import '@kol/ui/css/utilities.css'
import './index.css'
import App from './App.jsx'
import { applyTheme, getInitialTheme } from '@kol/ui'

const initialTheme = getInitialTheme()
applyTheme(initialTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
