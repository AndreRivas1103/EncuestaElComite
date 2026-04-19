import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

const apiOrigin = import.meta.env.VITE_API_ORIGIN || 'http://localhost:3010'

axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('http://localhost:3000')) {
    config.url = config.url.replace('http://localhost:3000', apiOrigin)
  }
  return config
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)