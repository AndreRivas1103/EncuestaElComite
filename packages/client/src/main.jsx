import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'
import './styles/page-surface.css'

const apiOrigin = import.meta.env.VITE_API_ORIGIN

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('http://localhost:3000')) {
    const base = apiOrigin ?? (import.meta.env.PROD ? '' : 'http://localhost:3010')
    config.url = config.url.replace('http://localhost:3000', base)
  }
  return config
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)