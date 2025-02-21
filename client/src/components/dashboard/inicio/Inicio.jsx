import React, { useEffect, useState } from 'react';


function Inicio() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar los datos del usuario del almacenamiento local
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData)); // Parsear el usuario desde localStorage
    }
  }, []);

  return (
    <div className=''>
      <h2>Inicio</h2>
      {user ? (
        <p>
          Bienvenido, {user.primerNombre} {user.primerApellido}!
        </p>
      ) : (
        <p>Cargando...</p>
      )}
      <div>
        <p>NOTAS DE VERSIÓN (PROYECTO EN DESARROLLO)</p>
        <p>VERSION 1.0 (BETA):</p>
        <ul>
          <li><b>Vistas Agregadas:</b>
            <ul>
              <li>Vista de Inventario</li>
              <li>Vista de Balance</li>
              <li>Vista de Estadísticas</li>
            </ul>
          </li>
          <li><b>Funcionalidades Agregadas:</b>
            <ul>
              <li>Categorías:
                <ul>
                  <li>Creación de Categorías</li>
                  <li>Edición de Categorías</li>
                  <li>Eliminación de Categorías</li>
                  <li>Filtro por Categorías</li>
                </ul>
              </li>
              <li>Productos:
                <ul>
                  <li>Creación de Productos</li>
                  <li>Edición de Productos</li>
                  <li>Eliminación de Productos</li>
                  <li>Barra de búsqueda de productos</li>
                </ul>
              </li>
              <li>Balance:
                <ul>
                  <li>Agregación de ingresos del negocio</li>
                  <li>Agregación de egresos del negocio</li>
                  <li>Tabla de visualización de ingresos y egresos</li>
                  <li>Visualización de ingresos totales, egresos totales y balance</li>
                </ul>
              </li>
              <li>Visualizaciones de barras y de líneas:
                <ul>
                  <li>Visualización de diagrama de líneas con un balance mensual</li>
                  <li>Visualización de diagrama de barras con la información de ventas de productos</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Inicio;
