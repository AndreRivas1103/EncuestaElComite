import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/ConfirmLogout.css';

const ConfirmLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="logout-page">
      <div className="logout-container">
        <h1>El Comité</h1>
        <p>¿Seguro que deseas cerrar sesión?</p>
        
        <div className="button-group">
          <button 
            className="btn confirm-btn"
            onClick={handleLogout}
          >
            Sí
          </button>
          <button 
            className="btn cancel-btn"
            onClick={() => navigate(-1)}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogout;