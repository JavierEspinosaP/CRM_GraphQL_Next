import React, { useContext, useState, useEffect } from "react";
import OrderContext from "@/app/context/pedidos/ordersContext";

const ProductSummary = ({ product }) => {
  // Orders context

  const orderContext = useContext(OrderContext);
  const { productsQuantity, refreshTotal } = orderContext;

  

  const [quantity, setQuantity] = useState(0)
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshQuantity()
    refreshTotal()
  }, [quantity])

  const refreshQuantity = () => {
    const newProduct = {...product, quantity: Number(quantity)}
    console.log('Updated Product:', newProduct); // Debugging
    productsQuantity(newProduct);
    
  }
  

  const { nombre, precio } = product;

  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">{nombre}</p>
        <p>{precio}€</p>
      </div>
      <input
        type="number"
        placeholder="Cantidad"
        className="shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus_shadow-outline md:ml-4"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
      />
    </div>
  );
};

export default ProductSummary;
