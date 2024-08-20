"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import dynamic from "next/dynamic";
import { gql, useQuery } from '@apollo/client';

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

const BEST_CLIENTS = gql`
query getBestClients{
  getBestClients{
    cliente{
      nombre
      empresa
    }
    total
  }
}
`;

const BestSellers = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const { data, loading, error, startPolling, stopPolling } = useQuery(BEST_CLIENTS);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos.</p>;

  // Transformar los datos para el gráfico
  const chartData = data.getBestClients.map((seller, index) => ({
    vendedor: seller.cliente[0].nombre,
    value: seller.total,
    color: index === 0 ? "#006400" : index === 1 ? "#32CD32" : "#9ACD32", // Verde fuerte, verde claro, verde mezclado con amarillo
  }));

  const chartHeight = windowDimensions.width < 800 ? 400 : windowDimensions.width / 4;

  const chartStyle = {
    width: "90%",  // Aumentado a 90% para dar más espacio
    height: `${chartHeight}px`,
  };

  return (
    <>
      <Header />
      <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>
      <div className="flex justify-center">
        <div style={chartStyle}>
          <ResponsiveBar
            data={chartData}
            keys={["value"]}
            indexBy="vendedor"
            margin={{ top: 50, right: 130, bottom: 70, left: 80 }}  // Aumentado margen izquierdo
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={({ data }) => data.color}  // Usar el color definido en chartData
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Cliente",
              legendPosition: "middle",
              legendOffset: 46,  // Aumentado para mayor separación
              legendTextStyle: { fontSize: 16, fontWeight: 'bold' },
              tickTextColor: "#000",
              tickTextFontSize: 12,
              tickTextFontWeight: 'bold',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 8,
              tickRotation: 0,
              legend: "Total Ventas",
              legendPosition: "middle",
              legendOffset: -60,  // Aumentado a -60 para mayor separación
              legendTextStyle: { fontSize: 14, fontWeight: 'bold' },
              tickTextColor: "#000",
              tickTextFontSize: 12,
              tickTextFontWeight: 'bold',
            }}
            labelSkipWidth={15}
            labelSkipHeight={15}
            labelTextColor="#ffffff"  // Número en blanco
            label={(d) => `${d.value} €`}  // Agrega € después del número
            labelFormat={d => `${d} €`}  // Formato del número dentro de la barra
            labelTextStyle={{ fontWeight: 'bold', fontSize: '14px' }}  // Formato del número dentro de la barra
            legends={[]}
            role="application"
            ariaLabel="Nivo bar chart de mejores vendedores"
            barAriaLabel={(e) =>
              e.id + ": " + e.formattedValue + " ventas por " + e.indexValue
            }
          />
        </div>
      </div>
    </>
  );
};

export default BestSellers;
