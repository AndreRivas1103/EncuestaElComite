// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Encuesta from './pages/Encuesta';
import Gracias from './pages/Gracias';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/encuesta" element={<Encuesta />} />
        <Route path="/gracias" element={<Gracias />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
