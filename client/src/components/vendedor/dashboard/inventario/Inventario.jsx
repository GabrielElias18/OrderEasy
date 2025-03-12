import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, FolderPlus, Settings } from 'lucide-react';
import VisualizarProductos from './vistas/VisualizarProductos';
import CrearCategoriaForm from './vistas/CrearCategoriaForm';
import CrearProductoForm from './vistas/CrearProductoForm';
import GestionarCategoriaForm from './vistas/GestionarCategoriaForm';
import { getCategoriesByUser } from '../../../../services/categoryServices';
import { getAllProducts } from '../../../../services/productServices';
import './Inventario.css';

function Inventario() {
  const [isCrearCategoriaVisible, setCrearCategoriaVisible] = useState(false);
  const [isCrearProductoVisible, setCrearProductoVisible] = useState(false);
  const [isGestionarCategoriaVisible, setGestionarCategoriaVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem('token');
        const categoriasData = await getCategoriesByUser(token);
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const productosData = await getAllProducts(token);
        if (Array.isArray(productosData)) {
          setProductos(productosData);
        } else {
          console.error("La respuesta no contiene un array válido.");
          setProductos([]);
        }
      } else {
        console.error("No se encontró el token.");
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setProductos([]);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = selectedCategoria
      ? producto.categoriaNombre === selectedCategoria
      : true;

    const coincideNombre = searchTerm
      ? producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return coincideCategoria && coincideNombre;
  });

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto._id === updatedProduct._id ? updatedProduct : producto
        )
      );
      await Swal.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: 'El producto se ha actualizado correctamente.',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el producto.',
      });
    }
  };

  const handleDeleteProduct = async (deletedProductId) => {
    try {
      setProductos((prevProductos) =>
        prevProductos.filter((producto) => producto._id !== deletedProductId)
      );
      await Swal.fire({
        icon: 'success',
        title: '¡Producto eliminado!',
        text: 'El producto se ha eliminado correctamente.',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto.',
      });
    }
  };

  return (
    <div className="inventario-main">
      <div className="inventario-top">
        <div className="inventario-buttons-left">
          <button 
            className="inventario-btn inventario-btn-primary"
            onClick={() => setCrearProductoVisible(true)}
          >
            <Plus size={18} />
            <span>Agregar Producto</span>
          </button>
          <button 
            className="inventario-btn inventario-btn-secondary"
            onClick={() => setCrearCategoriaVisible(true)}
          >
            <FolderPlus size={18} />
            <span>Agregar Categoría</span>
          </button>
        </div>
        
        <div className="inventario-filters-right">
          <button 
            className="inventario-btn inventario-btn-secondary"
            onClick={() => setGestionarCategoriaVisible(true)}
          >
            <Settings size={18} />
            <span>Gestionar Categorías</span>
          </button>
          <select
            className="inventario-select"
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria._id} value={categoria.nombre}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="inventario-search-sticky">
        <input
          type="text"
          className="inventario-search-input"
          placeholder="Buscar Producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="inventario-products">
        <VisualizarProductos
          productos={productosFiltrados}
          onVerDetalles={setProductoSeleccionado}
        />
      </div>
      
      {productoSeleccionado && (
        <ProductoInfo
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          onDelete={handleDeleteProduct}
          onUpdate={handleUpdateProduct}
        />
      )}
      
      <CrearCategoriaForm
        isVisible={isCrearCategoriaVisible}
        onClose={() => setCrearCategoriaVisible(false)}
      />
      <CrearProductoForm
        isVisible={isCrearProductoVisible}
        onClose={() => setCrearProductoVisible(false)}
      />
      <GestionarCategoriaForm
        isVisible={isGestionarCategoriaVisible}
        onClose={() => setGestionarCategoriaVisible(false)}
      />
    </div>
  );
}

export default Inventario;