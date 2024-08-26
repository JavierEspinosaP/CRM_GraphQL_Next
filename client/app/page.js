"use client";

import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Header from "./components/Header";
import Client from "./components/Client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hasCookie } from "cookies-next";

const GET_CLIENTS_SELLER = gql`
  query getClientsSeller {
    getClientsSeller {
      nombre
      apellido
      empresa
      email
      id
    }
  }
`;

const Index = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Check if the code is running on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const cookie = hasCookie("session-token");

  useEffect(() => {
    if (isClient && !cookie) {
      router.push("/login");
    }
  }, [isClient, cookie, router]);

  // Skip query execution if not on the client-side or if there's no cookie
  const { data, loading, error } = useQuery(GET_CLIENTS_SELLER, {
    fetchPolicy: "network-only",
    skip: !isClient || !cookie,
  });

  // Avoid rendering until the component is client-side
  if (!isClient) {
    return null;
  }

  return (
    <>
      <Header />
      <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>

      <Link href="/newClient">
        <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">
          Nuevo Cliente
        </p>
      </Link>

      {loading ? (
        <p className="text-2xl text-gray-800 font-light">Cargando...</p>
      ) : error ? (
        <p className="text-2xl text-gray-800 font-light">Error al cargar los clientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto shadow-md mt-10 w-full">
            <thead className="bg-gray-800 md:table-header-group hidden">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Email</th>
                <th className="w-1/5 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white block md:table-row-group">
              {data?.getClientsSeller?.map((cliente) => (
                <Client key={cliente.id} cliente={cliente} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Index;
