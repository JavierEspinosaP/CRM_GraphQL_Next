"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import dynamic from "next/dynamic";
import { gql, useQuery } from "@apollo/client";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";

// Dynamically load the ResponsiveBar component from @nivo/bar to avoid SSR issues
const ResponsiveBar = dynamic(() => import("@nivo/bar").then((m) => m.ResponsiveBar), {
  ssr: false,
});

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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cookie = isClient ? hasCookie("session-token") : false;

  useEffect(() => {
    if (isClient && !cookie) {
      router.push("/login");
    }
  }, [isClient, cookie, router]);

  const { data, loading, error, startPolling, stopPolling } = useQuery(BEST_SELLERS, {
    skip: !isClient, // Skip query if not on client-side
  });

  useEffect(() => {
    if (isClient && cookie) {
      startPolling(1000); // Poll every 1 second for fresh data
    }
    return () => {
      stopPolling(); // Stop polling when component unmounts
    };
  }, [isClient, cookie, startPolling, stopPolling]);

  if (!isClient || !cookie) {
    return <p>Cargando...</p>;
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos.</p>;

  const chartData = data.getBestSellers.map((seller, index) => ({
    vendedor: seller.vendedor[0].nombre,
    value: seller.total,
    color: index === 0 ? "#006400" : index === 1 ? "#32CD32" : "#9ACD32",
  }));

  const chartStyle = {
    width: "100%",
    maxWidth: "800px",
    height: "400px",
  };

  return (
    <>
      <Header />
      <h1 className="text-2xl text-gray-800 font-light text-center">Best Sellers</h1>
      <div className="flex justify-center">
        <div style={chartStyle} className="bg-white p-4 rounded-lg shadow-lg">
          <ResponsiveBar
            data={chartData}
            keys={["value"]}
            indexBy="vendedor"
            margin={{ top: 50, right: 50, bottom: 70, left: 50 }}
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
              legend: "Seller",
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
              legend: "Total Sales",
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
            ariaLabel="Nivo bar chart of best sellers"
            barAriaLabel={(e) =>
              e.id + ": " + e.formattedValue + " sales by " + e.indexValue
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

export default BestSellers;
