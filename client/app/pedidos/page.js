'use client'
import React from 'react'
import Link from 'next/link'
import Header from '../components/Header';
import Order from '../components/Order';
import {gql, useQuery} from '@apollo/client'

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

function Pedidos() {

  const {data, loading, error} = useQuery(GET_ORDERS)

  if (loading) return 'Cargando...'

const {getOrdersBySeller} = data
  console.log(data);
  
  
  return (<>
    <Header />
    <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
    <Link href='/newOrder'>
      <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">Nuevo Pedido</p>
    </Link>

    {getOrdersBySeller.length === 0 ?  
    (
      <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
    ): getOrdersBySeller.map(order => (
      <Order key={order.id} order={order} />
    ))}
  </>

  )
}

export default Pedidos