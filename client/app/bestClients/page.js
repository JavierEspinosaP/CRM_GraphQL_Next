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

const BEST_CLIENTS = gql`
  query getBestClients {
    getBestClients {
      cliente {
        nombre
        empresa
      }
      total
    }
  }
`;

const BestClients = () => {
  const router = useRouter();
  const cookie = hasCookie("session-token");

  // Coloca los hooks en el nivel superior para asegurar que se llamen incondicionalmente
  const { data, loading, error, startPolling, stopPolling } = useQuery(BEST_CLIENTS);
  const [marginRight, setMarginRight] = useState(30);

  useEffect(() => {
    if (!cookie) {
      router.push("/login");
    }
  }, [cookie, router]); // Incluye las dependencias faltantes

  useEffect(() => {
    if (cookie) {
      startPolling(1000);
    }

    // Ajuste del margen derecho en función del ancho de la pantalla
    const handleResize = () => {
      if (window.innerWidth <= 450) {
        setMarginRight(10); // Reduce el margen derecho en pantallas pequeñas
      } else {
        setMarginRight(30); // Margen derecho normal en pantallas más grandes
      }
    };

    // Llamar inmediatamente y también agregar el evento de escucha
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      stopPolling();
      window.removeEventListener("resize", handleResize);
    };
  }, [cookie, startPolling, stopPolling]); // Asegúrate de incluir todas las dependencias necesarias

  if (!cookie) {
    // Evita el renderizado hasta que se complete el redireccionamiento
    return null;
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos.</p>;

  // Transformar los datos para el gráfico
  const chartData = data.getBestClients.map((client, index) => ({
    cliente: client.cliente[0].nombre,
    value: client.total,
    color: index === 0 ? "#006400" : index === 1 ? "#32CD32" : "#9ACD32",
  }));

  const chartStyle = {
    width: "100%",
    maxWidth: "900px",
    height: "450px",
  };

  return (
    <>
      <Header />
      <h1 className="text-2xl text-gray-800 font-light text-center">
        Mejores Clientes
      </h1>
      <div className="flex justify-center mt-8">
        <div style={chartStyle} className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveBar
            data={chartData}
            keys={["value"]}
            indexBy="cliente"
            margin={{ top: 60, right: marginRight, bottom: 80, left: 60 }} // Uso de marginRight basado en el ancho de la pantalla
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
              legend: "Cliente",
              legendPosition: "middle",
              legendOffset: 50,
              tickTextColor: "#000",
              legendText: {
                fontSize: 16,
                fontWeight: "bold",
              },
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 8,
              tickRotation: 0,
              legend: "Total Compras",
              legendPosition: "middle",
              legendOffset: -70,
              tickTextColor: "#000",
              legendText: {
                fontSize: 16,
                fontWeight: "bold",
              },
            }}
            labelSkipWidth={15}
            labelSkipHeight={15}
            labelTextColor="#ffffff"
            label={(d) => `${d.value} €`}
            labelFormat={(d) => `${d} €`}
            legends={[]}
            role="application"
            ariaLabel="Nivo bar chart de mejores clientes"
            barAriaLabel={(e) =>
              e.id + ": " + e.formattedValue + " compras por " + e.indexValue
            }
            theme={{
              axis: {
                legend: {
                  text: {
                    fontSize: 16,
                    fontWeight: "bold",
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

export default BestClients;
