import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import VisualizarProductos from './vistas/VisualizarProductos';
import CrearCategoriaForm from './vistas/CrearCategoriaForm';
import CrearProductoForm from './vistas/CrearProductoForm';
import GestionarCategoriaForm from './vistas/GestionarCategoriaForm';
import { getCategoriesByUser } from '../../../../services/categoryServices';
import { getAllProducts } from '../../../../services/productServices';
import './Inventario.css';

function Inventario() {
  const navigate = useNavigate();
  const [isCrearCategoriaVisible, setCrearCategoriaVisible] = useState(false);
  const [isCrearProductoVisible, setCrearProductoVisible] = useState(false);
  const [isGestionarCategoriaVisible, setGestionarCategoriaVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleVerDetalles = (productoId) => {
    navigate(`/dashboard/inventario/producto/${productoId}`);
  };

  return (
    <div>
      <div className="botones-inventario">
        <button onClick={() => setCrearProductoVisible(true)}>Agregar Producto</button>
        <button onClick={() => setGestionarCategoriaVisible(true)}>Gestionar Categorías</button>
      </div>

      <div className="categoria-busqueda">
        <button onClick={() => setCrearCategoriaVisible(true)}>Agregar Categoría</button>
        <div className="busqueda">
          <select
            name="categorias"
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
          <input
            type="text"
            placeholder="Buscar Producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <VisualizarProductos
        productos={productosFiltrados}
        onVerDetalles={handleVerDetalles}
      />

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
