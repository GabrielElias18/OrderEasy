import React, { useState } from 'react';
import './styles/VisualizarProductos.css';
import ProductoInfo from './ProductoInfo'; // Importar el componente ProductoInfo
import { deleteProduct } from '../../../../services/productServices'; // Importar la función deleteProduct

function VisualizarProductos({ productos }) {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const handleProductoClick = (producto) => {
    setProductoSeleccionado(producto); // Establecer el producto seleccionado
  };

  const handleClosePopup = () => {
    setProductoSeleccionado(null); // Cerrar el popup
  };

  const handleDelete = async (productoId) => {
    const token = localStorage.getItem('token'); // Recupera el token del localStorage

    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    try {
      // Llamar a la función deleteProduct pasando el id del producto
      await deleteProduct(productoId, token);
      // Actualiza la lista de productos después de eliminar el producto
      setProductoSeleccionado(null); // Cierra el popup después de eliminar el producto
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  if (!productos || productos.length === 0) {
    return <p className="sin-productos">No hay productos disponibles.</p>;
  }

  return (
    <div className="productos-container">
      {productos.map((producto) => (
        <div key={producto.productoid} className="producto-card" onClick={() => handleProductoClick(producto)}>
          <div className="producto-imagen-container">
            {producto.imagenes && producto.imagenes.length > 0 ? (
              <img
                src={producto.imagenes[0].startsWith("http") ? producto.imagenes[0] : `http://localhost:3000/uploads/${producto.imagenes[0]}`}
                alt={producto.nombre}
                className="producto-imagen"
                onError={(e) => (e.target.src = "/images/default-product.png")}
              />

            ) : (
              <img
                src="/images/default-product.png"
                alt="Sin imagen"
                className="producto-imagen"
              />
            )}
          </div>
          <h3 className="producto-nombre">{producto.nombre}</h3>
          <p className="producto-cantidad">Cantidad Disponible: {producto.cantidadDisponible}</p>
        </div>
      ))}

      {/* Mostrar el popup con los detalles del producto si hay un producto seleccionado */}
      {productoSeleccionado && (
        <ProductoInfo
          producto={productoSeleccionado}
          onClose={handleClosePopup}
          onDelete={() => handleDelete(productoSeleccionado.productoid)} // Pasar la función handleDelete como prop
        />
      )}
    </div>
  );
}

export default VisualizarProductos;
