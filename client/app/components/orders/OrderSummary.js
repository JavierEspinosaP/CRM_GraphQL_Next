import React, { useContext } from "react";
import OrderContext from "@/app/context/pedidos/ordersContext";
import ProductSummary from "./ProductSummary";

function OrderSummary() {
  // Orders context

  const orderContext = useContext(OrderContext);
  const { products } = orderContext;

  const nombres = products.map((product) => {
    return product.nombre;
  });

  
  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        3.- Ajusta las cantidades de cada producto
      </p>
      {products.length > 0 ? (
        <>
          {products.map(product => (
          <ProductSummary key={product.id} product={product} />
        ))}      
        </>

      ) : (
        <p className="mt-3 text-sm">No hay productos seleccionados</p>
      )}
    </>
  );
}

export default OrderSummary;
