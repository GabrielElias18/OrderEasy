import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import './styles/ProductoInfo.css';
import { deleteProduct } from '../../../../services/productServices';
import EditarProductoForm from './EditarProductoForm';

function ProductoInfo({ producto, onClose, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    const confirmarEliminar = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    });
  
    if (confirmarEliminar.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }
  
        if (!producto.productoid) {
          console.error('Producto ID no encontrado');
          return;
        }
  
        await deleteProduct(producto.productoid, token);
        onDelete(producto.productoid); // Llama a onDelete para actualizar la lista de productos
        onClose(); // Cierra el modal
        window.location.reload(); // Recarga la página
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Mostrar el formulario de edición
  };

  const handleUpdate = (updatedProduct) => {
    onUpdate(updatedProduct); // Llama a onUpdate para actualizar la lista de productos
    setIsEditing(false); // Cierra el formulario de edición
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Detalles del Producto</h2>
        <button className="cerrar" onClick={onClose}>X</button>
        {isEditing ? (
          <EditarProductoForm
            producto={producto}
            onClose={() => setIsEditing(false)}
            onUpdate={handleUpdate}
          />
        ) : (
          <>
            <div className="producto-info">
              <h3 className="tittle">{producto.nombre}</h3>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Cantidad Disponible:</strong> {producto.cantidadDisponible}</p>
              <p><strong>Precio de Compra:</strong> ${producto.precioCompra}</p>
              <p><strong>Precio de Venta:</strong> ${producto.precioVenta}</p>
              <p><strong>Categoría:</strong> {producto.categoriaNombre}</p>
            </div>
            <div className="producto-actions">
              <button className="editar-btn" onClick={handleEdit}>
                Editar
              </button>
              <button className="eliminar-btn" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductoInfo;