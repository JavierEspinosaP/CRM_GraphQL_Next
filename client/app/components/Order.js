import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";

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

const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

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

export default function Order({ order }) {
  const {
    id,
    total,
    cliente: { nombre, apellido, telefono, email },
    estado,
    pedido,
    cliente,
  } = order;

  //Mutation to change state of an order

  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  const [orderState, setOrderState] = useState(estado);
  const [styleClass, setStyleClass] = useState("");

  const handleStateChange = (e) => {
    changeOrderState(e.target.value);
  };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (orderState) {
        orderClass();
      }
    }, [orderState]);


  //Function that modifies the color of the order depending on its state



  const orderClass = () => {
    if (orderState === "PENDING") {
      setStyleClass("border-yellow-500");
    } else if (orderState === "COMPLETED") {
      setStyleClass("border-green-500");
    } else {
      setStyleClass("border-red-800");
    }
  };

  const changeOrderState = async (newState) => {
    try {
      const datos = {
        variables: {
          id: id,
          input: {
            estado: newState,
            cliente: cliente.id,
          },
        },
      };
      console.log("datos que se envian: ", datos);

      const { data } = await updateOrder({
        variables: {
          id,
          input: {
            estado: newState,
            cliente: cliente.id,
          },
        },
      });

      setOrderState(data.updateOrder.estado);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDeleteOrder = () => {
    Swal.fire({
      title: "Deseas eliminar a este pedido?",
      text: "Esta acción es irrevocable",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar pedido",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const data = await deleteOrder({
            variables: {
              id,
            },
          });
          Swal.fire("Eliminado", data.deleteOrder, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

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
          onChange={handleStateChange} // Este es el manejador onChange
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
            <p className="text-sm text-gray-600">
              Cantidad:{" "}
              {product.cantidad}
            </p>
          </div>
        ))}
        <p className="text-gray-800 mt-3 font-bold">
          Total a pagar:
          <span className="font-light"> {total} €</span>
        </p>

        <button
          onClick={() => confirmDeleteOrder()}
          className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 text-white rounded leading-tigh"
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
