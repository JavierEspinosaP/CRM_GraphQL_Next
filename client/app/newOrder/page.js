"use client";
import React, { useContext } from "react";
import AssignClient from "../components/orders/AssignClient";
import AssignProduct from "../components/orders/AssignProduct";
import OrderSummary from "@/app/components/orders/OrderSummary";
import Total from "@/app/components/orders/Total";

//Order context

import OrderContext from "../context/pedidos/ordersContext";

function NewOrder() {
  // Use Context and extract its values

  const orderContext = useContext(OrderContext);

  return (
    <>
      <h1 className="text-2xl text-gray-800 font-light">Create new order</h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AssignClient />
          <AssignProduct />
          <OrderSummary/>
          <Total />
          
          <button
          type='button'
          className={` text-white bg-gray-800 w-full mt-5 p-2 uppercase font-bold hover:bg-gray-900`}
          >Registrar pedido</button>
        </div>
      </div>
    </>
  );
}

export default NewOrder;
