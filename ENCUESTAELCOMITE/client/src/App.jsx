import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import IniciarSesion from "./pages/Iniciarsesion.jsx";
import SeleccionarEncuesta from "./pages/SeleccionarEncuesta.jsx";
import Contacto from "./pages/Contacto.jsx";
import RegistroEncuestas from "./pages/RegistroEncuesta.jsx";
import InicioCoordinador from "./pages/InicioCoordinador.jsx";
import TukiInicio from "./pages/prueba1.jsx";
import NuevoEvento from "./pages/NuevoEvento.jsx";
import GuardarPreguntas from "./pages/GuardarPreguntas.jsx";
import CrearPregunta from "./pages/CrearPregunta.jsx";
import Calendario from "./pages/Calendario.jsx";
import Encuesta from "./pages/Encuesta.jsx";
import Ensayo from "./pages/InicioCoordinadorPrueba.jsx";
import ConfirmarCierre from "./pages/ConfirmLogout";
import PrevisualizacionE from "./pages/PreviewEncuesta.jsx";
import RealizarEncuesta from "./pages/Escoger_Encuentas.jsx";
import RellenarDatos from "./pages/Rellenar_Datos.jsx";
import ResponderEncuesta from "./pages/Responder_Encuesta.jsx";
import VisualizarResultados from "./pages/Visualizar_Resultados.jsx";
import TyC from "./pages/TyC.jsx";
import VerResultados from "./pages/Ver_Resultados.jsx";
import GraciasPorParticipar from "./pages/GraciasPorParticipar.jsx";
import DatosPost from "./pages/Rellenar_Datos_Post.jsx";
import GraciasPorParticiparPost from "./pages/GraciasPorParticiparPost.jsx"; // Nuevo
import ResponderEncuestaPost from "./pages/Responder_Encuesta_Post.jsx"; // Nuevo

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route
              path="/seleccionar-encuesta"
              element={<SeleccionarEncuesta />}
            />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/registro-encuestas" element={<RegistroEncuestas />} />
            <Route path="/inicio-coordinador" element={<InicioCoordinador />} />
            <Route path="/info-encuesta" element={<TukiInicio />} />
            <Route path="/nuevo-evento" element={<NuevoEvento />} />
            <Route path="/guardar-pregunta" element={<GuardarPreguntas />} />
            <Route path="/crear-pregunta" element={<CrearPregunta />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/encuestas" element={<Encuesta />} />
            <Route path="/ensayo" element={<Ensayo />} />
            <Route path="/confirmar-cierre" element={<ConfirmarCierre />} />
            <Route path="/visualizacionE" element={<PrevisualizacionE />} />
            <Route path="/realizar-encuesta" element={<RealizarEncuesta />} />
            <Route path="/rellenar-datos" element={<RellenarDatos />} />
            <Route path="/responder-encuesta" element={<ResponderEncuesta />} />
            <Route
              path="/visualizar-resultados"
              element={<VisualizarResultados />}
            />
            <Route path="/terminos-y-condiciones" element={<TyC />} />
            <Route path="/ver-resultados" element={<VerResultados />} />
            <Route path="/gracias-por-participar" element={<GraciasPorParticipar />} />
            <Route path="/rellenar-datos-post" element={<DatosPost />} />
            {/* Nuevas rutas */}
            <Route path="/gracias-por-participar-post" element={<GraciasPorParticiparPost />} />
            <Route path="/responder-encuesta-post" element={<ResponderEncuestaPost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;