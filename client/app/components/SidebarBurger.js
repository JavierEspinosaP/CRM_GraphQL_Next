"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = usePathname();

  // Conditionally render SidebarBurger based on the current route
  // If the current route is /login or /signup, do not render SidebarBurger
  if (router === "/login" || router === "/signup") {
    return null;
  }

  // Toggle sidebar open/closed state
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 focus:outline-none text-2xl p-2 rounded-md ${
          isOpen ? "text-white" : "text-black"
        } bg-black bg-opacity-20 mr-2`} // Se añade un margen derecho de 10px
      >
        ☰
      </button>

      {/* Fondo oscuro cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity duration-300 ml-[10px]"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ml-[10px]`} // Se añade un margen izquierdo de 10px
      >
        <aside
          className="bg-gray-800 min-h-screen p-5 opacity-90"
          // Aplicar diferentes anchos según el tamaño de la pantalla
          style={{
            width: "75%", // Por defecto en móvil
            maxWidth: "20rem", // Máximo ancho en móvil
            "@media (minWidth: 640px)": {
              // Tablet
              width: "50%",
              maxWidth: "16rem",
            },
            "@media (minWidth: 1024px)": {
              // Desktop
              width: "25%",
              maxWidth: "12rem",
            },
          }}
        >
          <h2 className="text-white font-black ml-6">CRM CLIENTS</h2>
          <nav className="mt-5 list-none ml-6">
            <li className={router === "/" ? "bg-blue-800 p-1" : "p-1"}>
              <Link href="/">
                <p className="text-white">Clientes</p>
              </Link>
            </li>
            <li className={router === "/pedidos" ? "bg-blue-800 p-1" : "p-1"}>
              <Link href="/pedidos">
                <p className="text-white">Pedidos</p>
              </Link>
            </li>
            <li className={router === "/productos" ? "bg-blue-800 p-1" : "p-1"}>
              <Link href="/productos">
                <p className="text-white">Productos</p>
              </Link>
            </li>
          </nav>

          <h2 className="text-white font-black mt-4 ml-6">Otras opciones</h2>
          <nav className="mt-5 list-none ml-6">
            <li
              className={router === "/bestSellers" ? "bg-blue-800 p-1" : "p-1"}
            >
              <Link href="/bestSellers">
                <p className="text-white">Mejores Vendedores</p>
              </Link>
            </li>
            <li
              className={router === "/bestClients" ? "bg-blue-800 p-1" : "p-1"}
            >
              <Link href="/bestClients">
                <p className="text-white">Mejores Clientes</p>
              </Link>
            </li>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
