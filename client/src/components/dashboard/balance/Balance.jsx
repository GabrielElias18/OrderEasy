import React, { useState, useEffect } from "react";
import RegistrarIngresoForm from "./vistas/RegistrarIngresoForm";
import RegistrarEgresoForm from "./vistas/RegistrarEgresoForm";
import TablaIngresos from "./vistas/TablaIngresos";
import TablaEgresos from "./vistas/TablaEgresos";
import { getVentas } from "../../../services/ventaService";
import { getEgresos } from "../../../services/egresoService";
import { IoMdTrendingUp } from "react-icons/io";
import { PiTrendDownBold } from "react-icons/pi";
import { MdAttachMoney } from "react-icons/md";

import "./balance.css";

function Balance({ token }) {
  const [mostrarTabla, setMostrarTabla] = useState("ingresos");
  const [mostrarIngreso, setMostrarIngreso] = useState(false);
  const [mostrarEgreso, setMostrarEgreso] = useState(false);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [egresosTotales, setEgresosTotales] = useState(0);

  const fetchDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const ventas = await getVentas(token);
      const egresos = await getEgresos(token);
      const totalIngresos = ventas.reduce(
        (sum, venta) => sum + (parseFloat(venta.total) || 0),
        0
      );
      const totalEgresos = egresos.reduce(
        (sum, egreso) => sum + (parseFloat(egreso.total) || 0),
        0
      );
      setIngresosTotales(totalIngresos);
      setEgresosTotales(totalEgresos);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [token]);

  // Formatear valores a moneda colombiana
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(valor);
  };

  return (
    <div>
      {/* Botones para abrir los formularios */}
      <div className="botones">
        <button
          className="nuevo-ingreso"
          onClick={() => setMostrarIngreso(true)}
        >
          Registrar Venta
        </button>
        <button className="nuevo-egreso" onClick={() => setMostrarEgreso(true)}>
          Registrar Egreso
        </button>
      </div>

      {/* Balance distribuido horizontalmente */}
      <div className="balance">
        <div className="tick balance-general">
          <MdAttachMoney className="icon-balance" />
          <h3>Balance General</h3>
          <p>{formatoMoneda(ingresosTotales - egresosTotales)}</p>
        </div>
        <div className="tick ingresos">
          <IoMdTrendingUp className="icon-ingreso" />
          <h3>Ingresos Totales</h3>
          <p>{formatoMoneda(ingresosTotales)}</p>
        </div>
        <div className="tick egresos">
          <PiTrendDownBold className="icon-egreso" />
          <h3>Egresos Totales</h3>
          <p>{formatoMoneda(egresosTotales)}</p>
        </div>
      </div>

      {/* Botones inferiores */}
      <div className="botones-expandibles">
        <button
          className="btn-ingresos"
          onClick={() => setMostrarTabla("ingresos")}
        >
          Ingresos
        </button>
        <button
          className="btn-egresos"
          onClick={() => setMostrarTabla("egresos")}
        >
          Egresos
        </button>
      </div>

      {/* Mostrar la tabla correspondiente y actualizar el balance después de una acción */}
      {mostrarTabla === "ingresos" && (
        <TablaIngresos actualizarBalance={fetchDatos} />
      )}
      {mostrarTabla === "egresos" && (
        <TablaEgresos actualizarBalance={fetchDatos} />
      )}

      {/* Formularios flotantes */}
      {mostrarIngreso && (
        <RegistrarIngresoForm
          cerrarFormulario={() => setMostrarIngreso(false)}
          actualizarBalance={fetchDatos}
        />
      )}
      {mostrarEgreso && (
        <RegistrarEgresoForm
          cerrarFormulario={() => setMostrarEgreso(false)}
          actualizarBalance={fetchDatos}
        />
      )}
    </div>
  );
}

export default Balance;
