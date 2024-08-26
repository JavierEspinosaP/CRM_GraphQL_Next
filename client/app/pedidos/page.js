"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Order from "../components/Order";
import { gql, useQuery } from "@apollo/client";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";

// GraphQL query to get orders by the seller
const GET_ORDERS_BY_SELLER = gql`
  query GetOrdersBySeller {
    getOrdersBySeller {
      id
      pedido {
        id
        nombre
        cantidad
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      total
      estado
    }
  }
`;

function Pedidos() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const cookie = hasCookie("session-token");

  // Set isClient to true when the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if the cookie is not present
  useEffect(() => {
    if (isClient && !cookie) {
      router.push("/login");
    }
  }, [cookie, router, isClient]);

  // Use the GET_ORDERS_BY_SELLER query to fetch orders
  const { data, loading, error, refetch } = useQuery(GET_ORDERS_BY_SELLER, {
    fetchPolicy: "no-cache",
    skip: !isClient || !cookie, // Skip the query if not client-side or no cookie
  });

  // Refetch orders when an order is deleted
  const handleOrderDeleted = () => {
    refetch();
  };

  if (!isClient) {
    return null; // Avoid rendering until client-side is confirmed
  }

  if (loading) {
    return (
      <>
        <Header />
        <p>Cargando...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <p>Error al cargar los pedidos.</p>
      </>
    );
  }

  const { getOrdersBySeller } = data;

  return (
    <>
      <Header />
      <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
      <Link href="/newOrder">
        <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">
          Nuevo Pedido
        </p>
      </Link>

      {getOrdersBySeller.length === 0 ? (
        <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
      ) : (
        getOrdersBySeller.map((order) => (
          <Order key={order.id} order={order} onOrderDeleted={handleOrderDeleted} />
        ))
      )}
    </>
  );
}

export default Pedidos;
