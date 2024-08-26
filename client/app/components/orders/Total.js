import React, { useContext } from "react";
import OrderContext from "@/app/context/pedidos/ordersContext";

const Total = () => {
  // Access the order context to get the total amount
  const orderContext = useContext(OrderContext);
  const { total } = orderContext;

  return (
    <div className="flex items-center mt-5 justify-between bg-gray-300 p-3">
      <h2 className="text-gray-800 text-lg">Total a pagar:</h2>
      <p className="text-gray-800 mt-0">{total}€</p>
    </div>
  );
};

export default Total;
