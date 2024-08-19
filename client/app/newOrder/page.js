"use client";
import React, { useContext, useState } from "react";
import AssignClient from "../components/orders/AssignClient";
import AssignProduct from "../components/orders/AssignProduct";
import OrderSummary from "@/app/components/orders/OrderSummary";
import Total from "@/app/components/orders/Total";
import { gql, useMutation } from "@apollo/client";
import {useRouter} from 'next/navigation';
import Swal from 'sweetalert2'

//Order context

import OrderContext from "../context/pedidos/ordersContext";

const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`;

const GET_ORDERS = gql`
query getOrdersBySeller{
  getOrdersBySeller{
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
}`

const NewOrder =() => {


  const [message, setMessage] = useState(null)
  // Use Context and extract its values

  const orderContext = useContext(OrderContext);
  const { client, products, total } = orderContext;


  //Mutation for create new order

  const [newOrder] = useMutation(NEW_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  const validateOrder = () => {
    return !products.every((product) => product.quantity > 0) ||
      total === 0 ||
      client.length === 0
      ? " opacity-50 cursor-not-allowed"
      : " ";
  };

  const router = useRouter();

  const createNewOrder = async () => {

    const { id } = client;


    //Remove not necessary of products
    const order = products.map(({__typename, stock, ...product}) => product)
    console.log(order);
    
    try {
      const {data} = await newOrder({
        variables: {
          input: {
            cliente: id,
            total,
            pedido: {
              id: order[0].id,
              nombre: order[0].nombre,
              precio: order[0].precio,
              cantidad: order[0].quantity
            }
          }

        }
      })

      //Redirect

      router.push('/pedidos')
      //Show alert

      Swal.fire(
        'Correcto',
        'El pedido se registró correctamente',
        'success'
      )
    } catch (error) {
      setMessage(error.message.replace('GraphQL error: ', ''))
      setTimeout(() => {
        setMessage(null)
      }, 3000);
    }
  };

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    )
  }

  return (
    <>
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
}

export default NewOrder;
