import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      {" | "}
      <Link to="/encuesta">Encuesta</Link>
      {" | "}
      <Link to="/gracias">Gracias</Link>
    </nav>
  );
}

export default Navbar;
