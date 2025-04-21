import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import IniciarSesion from './pages/Iniciarsesion.jsx'
import SeleccionarEncuesta from './pages/SeleccionarEncuesta.jsx'
import Contacto from './pages/Contacto.jsx'
import RegistroEncuestas from './pages/RegistroEncuesta.jsx'
import InicioCoordinador from './pages/InicioCoordinador.jsx'
import Tuki from './pages/prueba1.jsx'
import './App.css'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/seleccionar-encuesta" element={<SeleccionarEncuesta />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/registro-encuestas" element={<RegistroEncuestas />} />
        <Route path="/inicio-coordinador" element={<InicioCoordinador />} />
        <Route path="/info-encuesta" element={<Tuki />} />
      </Routes>
    </Router>
  )
}

export default App