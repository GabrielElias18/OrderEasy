import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../vistas/styles/TablaVentas.css";
import { getEgresos, deleteEgreso, updateEgreso } from "../../../../services/egresoService";

const TablaEgresos = ({ actualizarBalance }) => {
  const [egresos, setEgresos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 50;
  const [editingEgreso, setEditingEgreso] = useState(null);

  useEffect(() => {
    fetchEgresos();
  }, []);

  const fetchEgresos = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getEgresos(token);
      setEgresos(data);
    } catch (error) {
      console.error("Error al obtener los egresos:", error.mensaje);
    }
  };

  const handleEditar = (egreso) => {
    setEditingEgreso(egreso);
    Swal.fire({
      title: 'Editar Egreso',
      html: `
        <div class="swal2-input-container">
          <label for="cantidad">Cantidad:</label>
          <input 
            type="number" 
            id="cantidad" 
            class="swal2-input" 
            value="${egreso.cantidad}"
            min="1"
          >
          <label for="descripcion">Descripción:</label>
          <textarea 
            id="descripcion" 
            class="swal2-textarea"
          >${egreso.descripcion}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const cantidad = document.getElementById('cantidad').value;
        const descripcion = document.getElementById('descripcion').value;
        
        if (!cantidad || cantidad < 1) {
          Swal.showValidationMessage('La cantidad debe ser mayor a 0');
          return false;
        }
        
        return { cantidad: parseInt(cantidad), descripcion };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const updatedData = {
            cantidad: result.value.cantidad,
            descripcion: result.value.descripcion
          };
          
          await updateEgreso(egreso.egresoid, updatedData, token);
          
          // Update local state
          setEgresos(egresos.map(e => 
            e.egresoid === egreso.egresoid 
              ? { ...e, ...updatedData }
              : e
          ));

          // Actualizar el balance general
          actualizarBalance();

          Swal.fire({
            title: 'Actualizado',
            text: 'El egreso ha sido actualizado con éxito',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el egreso',
            icon: 'error'
          });
          console.error("Error al actualizar el egreso:", error.mensaje);
        }
      }
    });
  };

  const handleEliminar = async (egresoid) => {
    if (!egresoid) {
      console.error("Error: ID del egreso es undefined.");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await deleteEgreso(egresoid, token);
          setEgresos(egresos.filter((egreso) => egreso.egresoid !== egresoid));

          // Actualizar el balance general
          actualizarBalance();

          Swal.fire({
            title: "Eliminado",
            text: "El egreso ha sido eliminado con éxito.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el egreso.",
            icon: "error"
          });
          console.error("Error al eliminar el egreso:", error.mensaje);
        }
      }
    });
  };

  // ... resto del código permanece igual ...

  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const egresosPaginados = egresos.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(egresos.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <h3>Egresos</h3>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto Comprado</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {egresosPaginados.length > 0 ? (
            egresosPaginados.map((egreso) => (
              <tr key={egreso.egresoid}>
                <td>{new Date(egreso.createdAt).toLocaleDateString()}</td>
                <td>{egreso.productoNombre}</td>
                <td>{egreso.descripcion}</td>
                <td>{egreso.cantidad}</td>
                <td>
                  ${Number(egreso.total).toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <button 
                    className="editar-venta"
                    onClick={() => handleEditar(egreso)}
                  >
                    ✏️
                  </button>
                  <button
                    className="eliminar-venta"
                    onClick={() => handleEliminar(egreso.egresoid)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay egresos registrados</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="paginacion">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TablaEgresos;