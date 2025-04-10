import { useState } from 'react';
import axios from 'axios';

const FormularioPrediccion = () => {
  const [formulario, setFormulario] = useState({
    precio_venta: '',
    cantidad_disponible: '',
    historico_ventas: '',
    tiempo_en_mercado: '',
  });

  const [resultado, setResultado] = useState(null);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8001/api/predecir', {
        precio_venta: parseFloat(formulario.precio_venta),
        cantidad_disponible: parseFloat(formulario.cantidad_disponible),
        historico_ventas: parseFloat(formulario.historico_ventas),
        tiempo_en_mercado: parseFloat(formulario.tiempo_en_mercado)
      });

      console.log('Respuesta del servidor:', response.data);  // Verifica la respuesta del servidor

      // Calcula la clase con mayor probabilidad
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
        setResultado({
          error: `Error del servidor: ${error.response.data.message || 'No se pudo predecir la demanda'}`,
        });
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
        <input
          type="number"
          name="precio_venta"
          placeholder="Precio de venta"
          value={formulario.precio_venta}
          onChange={handleChange}
        />
        <input
          type="number"
          name="cantidad_disponible"
          placeholder="Cantidad disponible"
          value={formulario.cantidad_disponible}
          onChange={handleChange}
        />
        <input
          type="number"
          name="historico_ventas"
          placeholder="Histórico de ventas"
          value={formulario.historico_ventas}
          onChange={handleChange}
        />
        <input
          type="number"
          name="tiempo_en_mercado"
          placeholder="Tiempo en el mercado (días)"
          value={formulario.tiempo_en_mercado}
          onChange={handleChange}
        />
        <button type="submit">Predecir</button>
      </form>

      {resultado && (
        <div style={{ marginTop: '20px' }}>
          {resultado.error ? (
            <h4 style={{ color: 'red' }}>{resultado.error}</h4>
          ) : (
            <>
              <h4>Probabilidades de Demanda:</h4>
              <ul>
                {Object.entries(resultado.probabilidades).map(([nivel, prob]) => (
                  <li key={nivel}>
                    <strong>{nivel.toUpperCase()}:</strong> {prob}%
                  </li>
                ))}
              </ul>

              {resultado.clasePredicha && (
                <div>
                  <h5>
                    La clase predicha es: <strong>{resultado.clasePredicha}</strong> con un{' '}
                    <strong>{resultado.porcentaje}%</strong> de probabilidad.
                  </h5>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FormularioPrediccion;
