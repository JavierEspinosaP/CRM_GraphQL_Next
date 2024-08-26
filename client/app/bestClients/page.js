"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import dynamic from "next/dynamic";
import { gql, useQuery } from "@apollo/client";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";

// Dynamically load the ResponsiveBar component from @nivo/bar to avoid SSR issues
const ResponsiveBar = dynamic(() => import("@nivo/bar").then((m) => m.ResponsiveBar), { ssr: false });

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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [marginRight, setMarginRight] = useState(30);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cookie = isClient ? hasCookie("session-token") : false;

  useEffect(() => {
    if (isClient && !cookie) {
      router.push("/login");
    }
  }, [isClient, cookie, router]);

  const { data, loading, error, startPolling, stopPolling } = useQuery(BEST_CLIENTS, {
    skip: !isClient, // Skip query if not on client-side
  });

  useEffect(() => {
    if (cookie) {
      startPolling(1000); // Poll every 1 second for fresh data
    }

    const handleResize = () => {
      setMarginRight(window.innerWidth <= 450 ? 10 : 30);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      stopPolling();
      window.removeEventListener("resize", handleResize);
    };
  }, [cookie, startPolling, stopPolling]);

  if (!isClient || !cookie) {
    return <p>Cargando...</p>;
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos.</p>;

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
      <h1 className="text-2xl text-gray-800 font-light text-center">Best Clients</h1>
      <div className="flex justify-center mt-8">
        <div style={chartStyle} className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveBar
            data={chartData}
            keys={["value"]}
            indexBy="cliente"
            margin={{ top: 60, right: marginRight, bottom: 80, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={({ data }) => data.color}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 8,
              tickRotation: 0,
              legend: "Total Compras",
              legendPosition: "middle",
              legendOffset: -70,
              tickTextColor: "#000",
            }}
            labelSkipWidth={15}
            labelSkipHeight={15}
            labelTextColor="#ffffff"
            label={(d) => `${d.value} €`}
            labelFormat={(d) => `${d} €`}
            legends={[]}
            role="application"
            ariaLabel="Nivo bar chart of best clients"
            barAriaLabel={(e) =>
              `${e.id}: ${e.formattedValue} purchases by ${e.indexValue}`
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
