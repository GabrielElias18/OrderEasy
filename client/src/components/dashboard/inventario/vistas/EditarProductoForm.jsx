import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { updateProduct } from '../../../../services/productServices';

function EditarProductoForm({ producto, onClose, onUpdate }) {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [cantidadDisponible, setCantidadDisponible] = useState(producto.cantidadDisponible);
  const [precioCompra, setPrecioCompra] = useState(producto.precioCompra);
  const [precioVenta, setPrecioVenta] = useState(producto.precioVenta);
  const [categoriaId, setCategoriaId] = useState(producto.categoriaId);
  const [imagenes, setImagenes] = useState(producto.imagenes);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      // Llama a la API para actualizar el producto
      const updatedProduct = await updateProduct(
        producto.productoid,
        { nombre, descripcion, cantidadDisponible, precioCompra, precioVenta, categoriaId, imagenes },
        token
      );

      // Llama a onUpdate para actualizar la lista de productos en el componente padre
      onUpdate(updatedProduct);

      // Cierra el formulario de edición
      onClose();

      // Muestra una alerta de éxito y recarga la página después de que el usuario presione "OK"
      await Swal.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: 'El producto se ha actualizado correctamente.',
      }).then(() => {
        window.location.reload(); // Recarga la página
      });
    } catch (error) {
      // Muestra una alerta de error
      await Swal.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: 'El producto se ha actualizado correctamente.',
      }).then(() => {
        window.location.reload(); // Recarga la página
      });
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Editar Producto</h2>
        <button className="cerrar" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Cantidad Disponible:</label>
            <input
              type="number"
              value={cantidadDisponible}
              onChange={(e) => setCantidadDisponible(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio de Compra:</label>
            <input
              type="number"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Precio de Venta:</label>
            <input
              type="number"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="guardar-btn">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarProductoForm;