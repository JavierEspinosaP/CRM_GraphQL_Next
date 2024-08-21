"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import dynamic from "next/dynamic";
import { gql, useQuery } from "@apollo/client";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);

const BEST_SELLERS = gql`
  query getBestSellers {
    getBestSellers {
      vendedor {
        nombre
        email
      }
      total
    }
  }
`;

const BestSellers = () => {
  const cookie = hasCookie("session-token");

  const router = useRouter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!cookie) {
      return router.push("/login");
    }
  }, []);

  if (!cookie) {
    // Evita el renderizado hasta que se complete el redireccionamiento
    return null;
  }
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(BEST_SELLERS);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos.</p>;

  // Transformar los datos para el gráfico
  const chartData = data.getBestSellers.map((seller, index) => ({
    vendedor: seller.vendedor[0].nombre,
    value: seller.total,
    color: index === 0 ? "#006400" : index === 1 ? "#32CD32" : "#9ACD32", // Verde fuerte, verde claro, verde mezclado con amarillo
  }));

  const chartStyle = {
    width: "100%", // El gráfico ocupará todo el ancho del contenedor
    maxWidth: "800px", // Máximo ancho de 800px
    height: "400px", // Altura fija de 400px
  };

  return (
    <>
      <Header />
      <h1 className="text-2xl text-gray-800 font-light text-center">
        Mejores Vendedores
      </h1>
      <div className="flex justify-center">
        <div style={chartStyle} className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveBar
            data={chartData}
            keys={["value"]}
            indexBy="vendedor"
            margin={{ top: 50, right: 50, bottom: 70, left: 50 }} // Margen ajustado
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={({ data }) => data.color}
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
              legend: "Vendedor",
              legendPosition: "middle",
              legendOffset: 46,
              tickTextColor: "#000",
              tickTextFontSize: 12,
              tickTextFontWeight: "bold",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 8,
              tickRotation: 0,
              legend: "Total Ventas",
              legendPosition: "middle",
              legendOffset: -60,
              tickTextColor: "#000",
              tickTextFontSize: 12,
              tickTextFontWeight: "bold",
            }}
            labelSkipWidth={15}
            labelSkipHeight={15}
            labelTextColor="#ffffff"
            label={(d) => `${d.value} €`}
            labelFormat={(d) => `${d} €`}
            legends={[]}
            role="application"
            ariaLabel="Nivo bar chart de mejores vendedores"
            barAriaLabel={(e) =>
              e.id + ": " + e.formattedValue + " ventas por " + e.indexValue
            }
            theme={{
              axis: {
                legend: {
                  text: {
                    fontSize: 16,
                    fontWeight: "bold", // Asegura que las leyendas estén en negrita
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BestSellers;
