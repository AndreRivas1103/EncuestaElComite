import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import IniciarSesion from './pages/Iniciarsesion.jsx'
import InicioCoordinador from './pages/InicioCoordinador.jsx'
import Contacto from './pages/Contacto.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/inicio-coordinador" element={<InicioCoordinador />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </Router>
  )
}

export default App