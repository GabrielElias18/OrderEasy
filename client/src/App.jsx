// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Inventario from './components/dashboard/inventario/Inventario';
import Balance from './components/dashboard/balance/Balance';
import Estadisticas from './components/dashboard/estadisticas/Estadisticas';
import Login from './components/login/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Importar el componente de protección
import Inicio from './components/dashboard/inicio/Inicio';
import Registro from './components/login/Registro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/login" element={<Login />} />
        <Route path='/registro' element={<Registro/>} />

        {/* Ruta privada: Dashboard y sus subrutas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="inicio" element={<Inicio />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="balance" element={<Balance />} />
          <Route path="estadisticas" element={<Estadisticas />} />
        </Route>

        {/* Ruta de inicio */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
