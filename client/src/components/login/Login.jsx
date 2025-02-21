import React, { useState } from 'react';
import { Boxes } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authServices';
import Swal from 'sweetalert2';
import '../login/styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Show loading alert while trying to log in
      Swal.fire({
        title: "Iniciando sesión...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const data = await loginUser(username, password);
      
      // Close loading alert
      Swal.close();
      
      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido al panel de control",
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      setUser(data.usuario);
      setMessage('¡Inicio de sesión exitoso!');
      navigate('/dashboard/inicio');
    } catch (error) {
      // Close loading alert
      Swal.close();
      
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: error.response?.data?.mensaje || "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
        footer: '<a href="#">¿Necesitas ayuda con tu cuenta?</a>',
      });

      const errorMsg = error.response?.data?.mensaje || 'Error en el inicio de sesión.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="screen-container">
      <div className="login-wrapper">
        {/* Left side - Image Section (60%) */}
        <div className="image-section">
          <div className="image-overlay" />
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Inventory Management"
            className="background-image"
          />
          <div className="image-content">
            <h2>Sistema de Gestión de Inventarios</h2>
            <p>
              Gestiona tu inventario con precisión y lleva la productividad de tu negocio más allá con soluciones tecnológicas innovadoras.
            </p>
          </div>
        </div>

        {/* Right side - Login Form (40%) */}
        <div className="form-section">
          <div className="form-container">
            <div className="header">
              <div className="logo">
                <Boxes className="icon" />
              </div>
              <h1>OrderEasy</h1>
              <h2>Iniciar Sesión</h2>
            </div>

            {message && (
              <div className={`message ${message.includes('exitoso') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="username">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Ingresar
              </button>
            </form>

            <div className="register">
              <button 
                className="register-button"
                onClick={() => navigate('/registro')}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;