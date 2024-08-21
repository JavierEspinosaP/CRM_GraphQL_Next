"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Order from "../components/Order";
import { gql, useQuery } from "@apollo/client";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";

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
  const cookie = hasCookie("session-token");

  useEffect(() => {
    if (!cookie) {
      router.push("/login");
    }
  }, [cookie, router]);

  if (!cookie) {
    // Evita el renderizado hasta que se complete el redireccionamiento
    return null;
  }

  const { data, loading, error } = useQuery(GET_ORDERS_BY_SELLER, {
    fetchPolicy: "no-cache",
  });

  if (loading) return "Cargando...";

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
        getOrdersBySeller.map((order) => <Order key={order.id} order={order} />)
      )}
    </>
  );
}

export default Pedidos;
