import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

// GraphQL mutation to update an order's state
const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: OrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      cliente {
        id
      }
      estado
    }
  }
`;

// GraphQL mutation to delete an order
const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

// GraphQL query to fetch all orders by seller
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

export default function Order({ order, onOrderDeleted }) {
  // Destructure properties from the order prop
  const {
    id,
    total,
    cliente: { nombre, apellido, telefono, email },
    estado,
    pedido,
    cliente,
  } = order;

  // State for managing the order's current state and CSS class based on the state
  const [orderState, setOrderState] = useState(estado);
  const [styleClass, setStyleClass] = useState("");

  // Mutation hook to update an order
  const [updateOrder] = useMutation(UPDATE_ORDER);

  // Mutation hook to delete an order, with cache update logic
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      try {
        // Attempt to read the existing GET_ORDERS query from the cache
        const data = cache.readQuery({ query: GET_ORDERS });
        if (data) {
          const { getOrdersBySeller } = data;
          // Write a new query to the cache, excluding the deleted order
          cache.writeQuery({
            query: GET_ORDERS,
            data: {
              getOrdersBySeller: getOrdersBySeller.filter(
                (currentOrder) => currentOrder.id !== id
              ),
            },
          });
        }
      } catch (error) {
        // Handle potential errors if the cache does not contain the query
        console.error("Error al actualizar la caché:", error);
      }
    },
    onCompleted: () => {
      // Notify parent component and show success message when deletion completes
      onOrderDeleted();
      Swal.fire("Eliminado", "El pedido ha sido eliminado.", "success");
    },
    onError: (error) => {
      // Log the error and show an error message if deletion fails
      console.error("Error al eliminar el pedido:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el pedido.", "error");
    },
  });

  // Update the order's CSS class when the state changes
  useEffect(() => {
    if (orderState) {
      updateOrderClass();
    }
  }, [orderState]);

  // Function to update the CSS class based on the order's state
  const updateOrderClass = () => {
    if (orderState === "PENDING") {
      setStyleClass("border-yellow-500");
    } else if (orderState === "COMPLETED") {
      setStyleClass("border-green-500");
    } else {
      setStyleClass("border-red-800");
    }
  };

  // Handle state change for the order
  const handleStateChange = async (e) => {
    const newState = e.target.value;
    try {
      // Perform the update order mutation with the new state
      const { data } = await updateOrder({
        variables: {
          id,
          input: {
            estado: newState,
            cliente: cliente.id,
          },
        },
      });

      // Update the local state with the response from the mutation
      setOrderState(data.updateOrder.estado);
    } catch (error) {
      // Log the error if the mutation fails
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  // Confirm and delete the order
  const confirmDeleteOrder = () => {
    Swal.fire({
      title: "¿Deseas eliminar este pedido?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar pedido",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Perform the delete order mutation
          await deleteOrder({ variables: { id } });
        } catch (error) {
          // Log the error if the mutation fails
          console.error("Error al eliminar el pedido:", error);
        }
      }
    });
  };

  // JSX rendering of the order component
  return (
    <div
      className={`${styleClass} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}
    >
      <div>
        <p className="font-bold text-gray-800">
          Cliente: {nombre} {apellido}
        </p>
        {email && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            {email}
          </p>
        )}
        {telefono && (
          <p className="flex items-center my-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            {telefono}
          </p>
        )}
        <h2 className="text-gray-800 font-bold mt-10">Estado Pedido: </h2>
        <select
          className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
          value={orderState}
          onChange={handleStateChange}
        >
          <option value="COMPLETED">COMPLETADO</option>
          <option value="PENDING">PENDIENTE</option>
          <option value="CANCELED">CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2"> Resumen del pedido</h2>
        {pedido.map((product) => (
          <div key={product.id} className="mt-4">
            <p className="text-sm text-gray-600">Producto: {product.nombre}</p>
            <p className="text-sm text-gray-600">Cantidad: {product.cantidad}</p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">
          Total a pagar:
          <span className="font-light"> {total} €</span>
        </p>

        <button
          onClick={confirmDeleteOrder}
          className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 text-white rounded leading-tight"
        >
          Eliminar
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 ml-1"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
