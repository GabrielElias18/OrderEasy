import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LineChart, DollarSign, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';
import './styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu sesión se cerrará y deberás iniciar sesión nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión exitosamente.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK"
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo">
          <Package className="logo-icon" />
          <span className="logo-text">OrderEasy</span>
        </div>
      </div>

      <div className="menu-container">
        <nav className="menu-items">
          <h3 className="menu-title">Menú Principal</h3>

          <Link to="inicio" className="menu-item">
            <LayoutDashboard className="menu-icon" />
            <span>Inicio</span>
          </Link>   

          <Link to="inventario" className="menu-item">
            <Package className="menu-icon" />
            <span>Inventario</span>
          </Link>
          
          <Link to="balance" className="menu-item">
            <DollarSign className="menu-icon" />
            <span>Balance</span>
          </Link>

          <Link to="estadisticas" className="menu-item">
            <LineChart className="menu-icon" />
            <span>Estadísticas</span>
          </Link>
        </nav>
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut className="menu-icon" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
