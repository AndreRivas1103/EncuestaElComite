import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import IniciarSesion from './pages/Iniciarsesion.jsx'
import SeleccionarEncuesta from './pages/SeleccionarEncuesta.jsx'
import Contacto from './pages/Contacto.jsx'
import RegistroEncuestas from './pages/RegistroEncuesta.jsx'
import InicioCoordinador from './pages/InicioCoordinador.jsx'
import TukiInicio from './pages/prueba1.jsx'
import NuevoEvento from './pages/NuevoEvento.jsx'
import CrearEncuesta from './pages/CrearEncuesta.jsx';
import GuardarPreguntas from './pages/GuardarPreguntas.jsx';
import CrearPregunta from './pages/CrearPregunta.jsx';
import Calendario from './pages/Calendario.jsx';
import Encuesta from './pages/Encuesta.jsx';
import Ensayo from './pages/InicioCoordinadorPrueba.jsx';
import TipoEvento from './pages/TipoEncuesta.jsx';
import ConfirmarCierre from './pages/ConfirmLogout'
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
        <Route path="/info-encuesta" element={<TukiInicio />} />
        <Route path="/nuevo-evento" element={<NuevoEvento />} />
        <Route path="/crear-encuesta" element={<CrearEncuesta />} />
        <Route path="/nuevo-evento" element={<NuevoEvento />} />
        <Route path="/guardar-pregunta" element={<GuardarPreguntas />} />
        <Route path="/crear-pregunta" element={<CrearPregunta />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/encuestas" element={<Encuesta />} />
        <Route path="/ensayo" element={<Ensayo />} />
        <Route path="/Tipo-e" element={<TipoEvento/>} />
        <Route path="/confirmar-cierre" element={<ConfirmarCierre />} />
      </Routes>
    </Router>
  )
}

export default App