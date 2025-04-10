import { useState, useEffect } from 'react';
import axios from 'axios';

const FormularioPrediccion = () => {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    precioVenta: '',
    cantidadDisponible: '',
    historico_ventas: '',
    tiempo_en_mercado: '',
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [resumenVentas, setResumenVentas] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:3000/api/productos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const token = localStorage.getItem("token");
        const responseVentas = await axios.get('http://localhost:3000/api/ventas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const resumen = {};
        responseVentas.data.forEach((venta) => {
          const nombreProducto = venta.ProductoNombre; // <- corregido aquí
          const cantidadVendida = venta.cantidad || 0;
  
          if (resumen[nombreProducto]) {
            resumen[nombreProducto] += cantidadVendida;
          } else {
            resumen[nombreProducto] = cantidadVendida;
          }
        });
  
        const resumenArray = Object.entries(resumen).map(([nombre, cantidad]) => ({
          nombre,
          cantidad,
        }));
  
        setResumenVentas(resumenArray);
  
        // Mostrarlo solo en consola
        console.log('Resumen de ventas por producto:', resumenArray);
  
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      }
    };
  
    obtenerVentas();
  }, []);
  


  const handleSeleccionProducto = async (e) => {
    const producto = JSON.parse(e.target.value);
    setProductoSeleccionado(producto);

    const fechaActual = new Date();
    const fechaIngreso = new Date(producto.createdat);
    const tiempoEnInventario = Math.floor((fechaActual - fechaIngreso) / (1000 * 60 * 60 * 24));

    try {
      const token = localStorage.getItem("token");
      const responseVentas = await axios.get('http://localhost:3000/api/ventas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Ventas obtenidas del backend:", responseVentas.data);
      console.log("Producto seleccionado:", producto.nombre);
  

      // Crear resumen de ventas agrupadas por producto
      const resumen = {};
      responseVentas.data.forEach((venta) => {
        const nombreProducto = venta.producto_nombre;
        const cantidadVendida = venta.cantidad || 0;

        if (resumen[nombreProducto]) {
          resumen[nombreProducto] += cantidadVendida;
        } else {
          resumen[nombreProducto] = cantidadVendida;
        }
      });

      // Convertir resumen a array para mostrarlo
      const resumenArray = Object.entries(resumen).map(([nombre, cantidad]) => ({
        nombre,
        cantidad,
      }));
      setResumenVentas(resumenArray);
      console.log('Resumen de ventas por producto:', resumenArray);

      // Filtrar las ventas del producto seleccionado
      const ventasProducto = responseVentas.data.filter(venta => venta.productoNombre === producto.nombre);
      const historicoVentas = ventasProducto.reduce((total, venta) => total + (venta.cantidad || 0), 0);
      console.log(historicoVentas)

      setFormulario({
        ...formulario,
        precioVenta: producto.precioVenta || '',
        cantidadDisponible: producto.cantidadDisponible || '',
        tiempo_en_mercado: tiempoEnInventario || '',
        historico_ventas: historicoVentas || '',
      });

    } catch (error) {
      console.error('Error al obtener las ventas:', error);
    }
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8001/api/predecir', {
        precio_venta: parseFloat(formulario.precioVenta),
        cantidad_disponible: parseFloat(formulario.cantidadDisponible),
        historico_ventas: parseFloat(formulario.historico_ventas),
        tiempo_en_mercado: parseFloat(formulario.tiempo_en_mercado),
      });

      const clasePredicha = Object.entries(response.data).reduce((max, curr) => {
        return curr[1] > max[1] ? curr : max;
      });

      setResultado({
        probabilidades: response.data,
        clasePredicha: clasePredicha[0],
        porcentaje: clasePredicha[1],
      });
    } catch (error) {
      console.error('Error al predecir:', error);
      if (error.response) {
        setResultado({ error: `Error del servidor: ${error.response.data.message || 'No se pudo predecir la demanda'}` });
      } else if (error.request) {
        setResultado({ error: 'El servidor no responde. Verifica la conexión.' });
      } else {
        setResultado({ error: `Error desconocido: ${error.message}` });
      }
    }
  };

  return (
    <div>
      <h2>Formulario de Predicción de Demanda</h2>

      <form onSubmit={enviarDatos}>
        <select onChange={handleSeleccionProducto}>
          <option value="">Seleccione un producto</option>
          {Object.entries(
            productos.reduce((grupos, producto) => {
              const categoria = producto.categoria?.nombre || 'Sin categoría';
              if (!grupos[categoria]) grupos[categoria] = [];
              grupos[categoria].push(producto);
              return grupos;
            }, {})
          ).map(([categoria, productosCategoria]) => (
            <optgroup key={categoria} label={categoria}>
              {productosCategoria.map((producto) => (
                <option key={producto._id} value={JSON.stringify(producto)}>
                  {producto.nombre}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input
          type="number"
          name="precioVenta"
          placeholder="Precio de venta"
          value={formulario.precioVenta}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cantidadDisponible"
          placeholder="Cantidad disponible"
          value={formulario.cantidadDisponible}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="historico_ventas"
          placeholder="Histórico de ventas"
          value={formulario.historico_ventas}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tiempo_en_mercado"
          placeholder="Tiempo en el mercado (en días)"
          value={formulario.tiempo_en_mercado}
          onChange={handleChange}
          required
        />

        <button type="submit">Predecir Demanda</button>
      </form>

      {resultado && (
        <div style={{ marginTop: '1rem' }}>
          {resultado.error ? (
            <p style={{ color: 'red' }}>{resultado.error}</p>
          ) : (
            <>
              <h3>Resultado:</h3>
              <p><strong>Clase Predicha:</strong> {resultado.clasePredicha}</p>
              <p><strong>Probabilidad:</strong> {resultado.porcentaje.toFixed(2)}%</p>
              <h4>Distribución de Probabilidades:</h4>
              <ul>
                {Object.entries(resultado.probabilidades).map(([clase, prob]) => (
                  <li key={clase}>{clase}: {prob.toFixed(2)}%</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default FormularioPrediccion;
