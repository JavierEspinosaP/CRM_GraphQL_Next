import React, { useContext, useState, useEffect } from "react";
import OrderContext from "@/app/context/pedidos/ordersContext";

const ProductSummary = ({ product }) => {
  // Access the order context
  const orderContext = useContext(OrderContext);
  const { productsQuantity, refreshTotal } = orderContext;

  // Local state to manage the quantity of the product
  const [quantity, setQuantity] = useState(0);

  // Update quantity and refresh the total whenever the quantity changes
  useEffect(() => {
    refreshQuantity();
    refreshTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  // Function to refresh the quantity of the product in the context
  const refreshQuantity = () => {
    const newProduct = { ...product, quantity: Number(quantity) };
    console.log('Updated Product:', newProduct); // Debugging
    productsQuantity(newProduct);
  };

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
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
      />
    </div>
  );
};

export default ProductSummary;
