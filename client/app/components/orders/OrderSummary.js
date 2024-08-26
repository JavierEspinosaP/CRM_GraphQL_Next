import React, { useContext } from "react";
import OrderContext from "@/app/context/pedidos/ordersContext";
import ProductSummary from "./ProductSummary";

function OrderSummary() {
  // Access the order context to retrieve the selected products
  const orderContext = useContext(OrderContext);
  const { products } = orderContext;

  // Map through the products to get their names (if needed elsewhere)
  const nombres = products.map((product) => product.nombre);

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
        3.- Adjust the quantities of each product
      </p>
      {products.length > 0 ? (
        <>
          {products.map(product => (
            <ProductSummary key={product.id} product={product} />
          ))}      
        </>
      ) : (
        <p className="mt-3 text-sm">No products selected</p>
      )}
    </>
  );
}

export default OrderSummary;
