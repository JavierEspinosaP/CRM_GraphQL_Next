"use client";
import React, { useContext, useState, useEffect } from "react";
import AssignClient from "../components/orders/AssignClient";
import AssignProduct from "../components/orders/AssignProduct";
import OrderSummary from "@/app/components/orders/OrderSummary";
import Total from "@/app/components/orders/Total";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { hasCookie } from "cookies-next";
import Header from "../components/Header";

// Import the Order context to manage the order state
import OrderContext from "../context/pedidos/ordersContext";

// GraphQL mutation to create a new order
const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`;

// GraphQL query to fetch orders by the seller
const GET_ORDERS = gql`
  query getOrdersBySeller {
    getOrdersBySeller {
      id
      pedido {
        cantidad
        id
        nombre
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

const NewOrder = () => {
  // Check if the session cookie exists
  const cookie = hasCookie("session-token");

  const router = useRouter();
  // Redirect to the login page if the session cookie is not found
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!cookie) {
      return router.push("/login");
    }
  }, []);
  // Avoid rendering the component until the cookie validation is complete
  if (!cookie) {
    return null;
  }

  const [message, setMessage] = useState(null);

  // Use the OrderContext to extract client, products, and total values
  const orderContext = useContext(OrderContext);
  const { client, products, total } = orderContext;

  // Apollo mutation hook to execute the newOrder mutation and refetch the orders after mutation
  const [newOrder] = useMutation(NEW_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  // Function to validate the order before submission
  const validateOrder = () => {
    return !products.every((product) => product.quantity > 0) ||
      total === 0 ||
      client.length === 0
      ? " opacity-50 cursor-not-allowed"
      : " ";
  };

  // Function to create a new order and handle submission logic
  const createNewOrder = async () => {
    const { id } = client;

    // Remove unnecessary fields from products and construct the 'pedido' array
    console.log("CANTIDADES DEL PEDIDO: ", products);

    const order = products.map(({ __typename, stock, ...product }) => ({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad: product.quantity,
    }));

    try {
      // Execute the mutation to create a new order
      const { data } = await newOrder({
        variables: {
          input: {
            cliente: id,
            total,
            pedido: order, // Aquí se pasa el array completo de productos
          },
        },
      });

      // Redirect to the orders page after successful submission
      router.push("/pedidos");
      //Show alert
      Swal.fire("Correcto", "El pedido se registró correctamente", "success");
    } catch (error) {
      setMessage(error.message.replace("GraphQL error: ", ""));
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <>
      <Header />

      <h1 className="text-2xl text-gray-800 font-light">Create new order</h1>

      {message && showMessage()}

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <AssignClient />
          <AssignProduct />
          <OrderSummary />
          <Total />

          <button
            type="button"
            className={` text-white bg-gray-800 w-full mt-5 p-2 uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
            onClick={() => createNewOrder()}
          >
            Registrar pedido
          </button>
        </div>
      </div>
    </>
  );
};

export default NewOrder;
