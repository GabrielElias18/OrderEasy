import { useFormularioPrediccion } from './useFormularioPrediccion';
import SelectProducto from './SelectProducto';
import ResultadoPrediccion from './ResultadoPrediccion';
import './Formulario.css';

const FormularioPrediccion = () => {
  const {
    productos,
    formulario,
    resultado,
    handleChange,
    enviarDatos,
    handleSeleccionProducto,
  } = useFormularioPrediccion();

  return (
    <div className="container">
      <div className="formCard">
        <h2 className="title">Formulario de Predicción de Demanda</h2>

        <form className="form" onSubmit={enviarDatos}>
  <SelectProducto productos={productos} onChange={handleSeleccionProducto} />

  <div className="formGrid">
    <div>
      <label className="label" htmlFor="precioVenta">Precio de venta</label>
      <input
        className="input"
        type="number"
        name="precioVenta"
        id="precioVenta"
        value={formulario.precioVenta}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label className="label" htmlFor="cantidadDisponible">Cantidad disponible</label>
      <input
        className="input"
        type="number"
        name="cantidadDisponible"
        id="cantidadDisponible"
        value={formulario.cantidadDisponible}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label className="label" htmlFor="historico_ventas">Histórico de ventas</label>
      <input
        className="input"
        type="number"
        name="historico_ventas"
        id="historico_ventas"
        value={formulario.historico_ventas}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label className="label" htmlFor="tiempo_en_mercado">Tiempo en el mercado (días)</label>
      <input
        className="input"
        type="number"
        name="tiempo_en_mercado"
        id="tiempo_en_mercado"
        value={formulario.tiempo_en_mercado}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  <button className="button" type="submit">
    Predecir Demanda
  </button>
</form>



        {resultado && <ResultadoPrediccion resultado={resultado} />}
      </div>
    </div>
  );
};

export default FormularioPrediccion;
