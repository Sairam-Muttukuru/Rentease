import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from './i18n.js'
import './index.css'
import App from './App.jsx'
import './i18n';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
