// client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Otra ruta por si App.jsx es otra vista */}
        <Route path="/encuesta" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
