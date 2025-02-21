import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../vistas/styles/TablaVentas.css";
import { getVentas, deleteVenta, updateVenta } from "../../../../services/ventaService";

const TablaIngresos = ({ actualizarBalance }) => {
  const [ventas, setVentas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 15;
  const [editingVenta, setEditingVenta] = useState(null);

  useEffect(() => {
    fetchVentas();
  }, []);

  const fetchVentas = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getVentas(token);
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener las ventas:", error.mensaje);
    }
  };

  const handleEditar = (venta) => {
    setEditingVenta(venta);
    Swal.fire({
      title: 'Editar Venta',
      html: `
        <div class="swal2-input-container">
          <label for="cantidad">Cantidad:</label>
          <input 
            type="number" 
            id="cantidad" 
            class="swal2-input" 
            value="${venta.cantidad}"
            min="1"
          >
          <label for="descripcion">Descripción:</label>
          <textarea 
            id="descripcion" 
            class="swal2-textarea"
          >${venta.descripcion}</textarea>
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
          
          await updateVenta(venta.ventaid, updatedData, token);
          
          // Update local state
          setVentas(ventas.map(v => 
            v.ventaid === venta.ventaid 
              ? { ...v, ...updatedData }
              : v
          ));

          // Actualizar el balance general
          actualizarBalance();

          Swal.fire({
            title: 'Actualizado',
            text: 'La venta ha sido actualizada con éxito',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la venta',
            icon: 'error'
          });
          console.error("Error al actualizar la venta:", error.mensaje);
        }
      }
    });
  };

  const handleEliminar = async (ventaid) => {
    if (!ventaid) {
      console.error("Error: ID de la venta es undefined.");
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
          await deleteVenta(ventaid, token);
          setVentas(ventas.filter((venta) => venta.ventaid !== ventaid));

          // Actualizar el balance general
          actualizarBalance();

          Swal.fire({
            title: "Eliminado",
            text: "La venta ha sido eliminada con éxito.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la venta.",
            icon: "error"
          });
          console.error("Error al eliminar la venta:", error.mensaje);
        }
      }
    });
  };

  // ... resto del código permanece igual ...

  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicial + registrosPorPagina;
  const ventasPaginadas = ventas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ventas.length / registrosPorPagina);

  return (
    <div className="tabla-container">
      <h3>Ingresos</h3>
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto Vendido</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map((venta) => (
              <tr key={venta.ventaid}>
                <td>{new Date(venta.createdAt).toLocaleDateString()}</td>
                <td>{venta.productoNombre}</td>
                <td>{venta.descripcion}</td>
                <td>{venta.cantidad}</td>
                <td>
                  ${Number(venta.total).toLocaleString("es-CO", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  <button 
                    className="editar-venta"
                    onClick={() => handleEditar(venta)}
                  >
                    ✏️
                  </button>
                  <button
                    className="eliminar-venta"
                    onClick={() => handleEliminar(venta.ventaid)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay ventas registradas</td>
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

export default TablaIngresos;