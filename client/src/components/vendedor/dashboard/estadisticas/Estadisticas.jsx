import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Sidebar from '../sidebar/Sidebar';
import { getVentas } from '../../../../services/ventaService';
import { getEgresos } from '../../../../services/egresoService';

function Estadisticas() {
  const [productIncomeData, setProductIncomeData] = useState(null);
  const [monthlyBalanceData, setMonthlyBalanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No hay token disponible.');
          return;
        }

        const [ventas, egresos] = await Promise.all([
          getVentas(token),
          getEgresos(token),
        ]);

        if (!Array.isArray(ventas) || !Array.isArray(egresos)) {
          console.error('Datos no válidos recibidos.');
          return;
        }

        // Procesar ingresos por producto
        const ingresosPorProducto = ventas.reduce((acc, venta) => {
          acc[venta.productoNombre] = (acc[venta.productoNombre] || 0) + venta.total;
          return acc;
        }, {});

        const sortedProductoLabels = Object.keys(ingresosPorProducto).sort(
          (a, b) => ingresosPorProducto[b] - ingresosPorProducto[a]
        );
        const sortedProductoIngresos = sortedProductoLabels.map(label => ingresosPorProducto[label]);

        const colores = sortedProductoLabels.map(
          () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
        );

        setProductIncomeData({
          labels: sortedProductoLabels,
          datasets: [
            {
              label: 'Ingresos por Producto (COP)',
              data: sortedProductoIngresos,
              backgroundColor: colores,
              borderColor: colores.map(color => color.replace('0.5', '1')),
              borderWidth: 1,
            },
          ],
        });

        // Calcular balance mensual
        const calcularBalanceMensual = () => {
          const ingresosPorMes = ventas.reduce((acc, venta) => {
            const fecha = new Date(venta.createdAt);
            const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            acc[mes] = (acc[mes] || 0) + (venta.total || 0);
            return acc;
          }, {});

          const egresosPorMes = egresos.reduce((acc, egreso) => {
            const fecha = new Date(egreso.createdAt);
            const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            acc[mes] = (acc[mes] || 0) + (egreso.monto || 0);
            return acc;
          }, {});

          const allMonths = [...new Set([...Object.keys(ingresosPorMes), ...Object.keys(egresosPorMes)])].sort();
          const balanceMensual = allMonths.map(mes => (ingresosPorMes[mes] || 0) - (egresosPorMes[mes] || 0));

          return { labels: allMonths, data: balanceMensual };
        };

        const balanceMensual = calcularBalanceMensual();

        setMonthlyBalanceData({
          labels: balanceMensual.labels,
          datasets: [
            {
              label: 'Balance Mensual (COP)',
              data: balanceMensual.data,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatToCOP = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  if (!productIncomeData || !monthlyBalanceData) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="main-content">
      <div className="chartContainer">
        <h2>BALANCE MENSUAL</h2>
        <Line 
          data={monthlyBalanceData} 
          options={{
            scales: {
              y: {
                suggestedMin: Math.min(...monthlyBalanceData.datasets[0].data) - 1000, 
              },
            },
            plugins: {
              tooltip: {
                position: 'nearest',
                callbacks: {
                  label: (context) => {
                    return `Balance: ${formatToCOP(context.raw)}`;
                  },
                },
              },
            },
          }} 
        />
      </div>
      <div className="chartContainer">
        <h2>INGRESOS GENERADOS POR PRODUCTO</h2>
        <Bar 
          data={productIncomeData} 
          options={{
            plugins: {
              tooltip: {
                position: 'nearest',
                callbacks: {
                  label: (context) => {
                    return `Ingreso: ${formatToCOP(context.raw)}`;
                  },
                },
              },
            },
          }} 
        />
      </div>
    </div>
  );
}

export default Estadisticas;
