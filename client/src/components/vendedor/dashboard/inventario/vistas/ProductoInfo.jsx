import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './styles/ProductoInfo.css';
import { deleteProduct, getProductById } from '../../../../../services/productServices';
import EditarProductoForm from './EditarProductoForm';

function ProductoInfo({ id, onClose }) {
  const [producto, setProducto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire('Error', 'No se encontró el token de autenticación.', 'error');
          return;
        }

        const data = await getProductById(id, token);
        if (!data) {
          Swal.fire('Error', 'No se encontró el producto.', 'error');
          onClose();
          return;
        }

        setProducto(data);
      } catch (error) {
        console.error('Error al obtener el producto:', error);
        Swal.fire('Error', 'Hubo un problema al cargar el producto.', 'error');
        onClose();
      }
    };

    fetchProducto();
  }, [id, onClose]);

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
          Swal.fire('Error', 'No se encontró el token de autenticación.', 'error');
          return;
        }

        await deleteProduct(id, token);
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        onClose(); // Cerrar el modal después de eliminar
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  const handleUpdate = (updatedProduct) => {
    setProducto(updatedProduct);
    setIsEditing(false);
    Swal.fire({
      title: 'Producto actualizado',
      text: 'El producto se ha actualizado correctamente.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      setTimeout(() => {
        window.location.reload(); // 🔄 Se recarga con un pequeño retraso
      }, 500);
    });
  };

  if (!producto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "Editar Producto" : "Detalles del Producto"}</h2>
        <button className="detalle-cerrar" onClick={onClose}>X</button>

        {isEditing ? (
          <EditarProductoForm 
            producto={producto} 
            onClose={() => setIsEditing(false)} 
            onUpdate={handleUpdate} 
          />
        ) : (
          <>
            <div className="detalle-imagen-container">
              {producto.imagenes?.length > 0 ? (
                <img
                  src={producto.imagenes[0].startsWith("http") ? producto.imagenes[0] : `http://localhost:3000/uploads/${producto.imagenes[0]}`}
                  alt={producto.nombre}
                  className="detalle-imagen"
                  onError={(e) => (e.target.src = "/images/default-product.png")}
                />
              ) : (
                <img src="/images/default-product.png" alt="Sin imagen" className="detalle-imagen" />
              )}
            </div>

            <div className="detalle-info">
              <h3 className="detalle-titulo">{producto.nombre}</h3>
              <p><strong>Descripción:</strong> {producto.descripcion}</p>
              <p><strong>Cantidad Disponible:</strong> {producto.cantidadDisponible}</p>
              <p><strong>Precio de Compra:</strong> ${producto.precioCompra}</p>
              <p><strong>Precio de Venta:</strong> ${producto.precioVenta}</p>
              <p><strong>Categoría:</strong> {producto.categoriaNombre}</p>
            </div>

            <div className="detalle-acciones">
              <button className="detalle-editar-btn" onClick={() => setIsEditing(true)}>Editar</button>
              <button className="detalle-eliminar-btn" onClick={handleDelete}>Eliminar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductoInfo;
