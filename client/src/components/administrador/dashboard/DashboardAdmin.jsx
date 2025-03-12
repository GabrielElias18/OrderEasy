import React from "react";
import { Link, Outlet } from "react-router-dom";

const DashboardAdmin = () => {
  return (
    <div>
      <h1>Panel de Administrador</h1>
      <nav>
        <ul>
          <li><Link to="usuarios">Gestión de Usuarios</Link></li>
          <li><Link to="reportes">Reportes</Link></li>
          <li><Link to="configuracion">Configuración</Link></li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default DashboardAdmin;
