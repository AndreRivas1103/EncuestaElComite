import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bienvenido a la Encuesta del Comité</h1>
      
      {/* Aquí está el Link */}
      <Link to="/encuesta">
        <button>Ir a la Encuesta</button>
      </Link>
    </div>
  );
}

export default Home;