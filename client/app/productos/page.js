'use client'

import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client'
import Header from '../components/Header';
import Product from '../components/Product'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { hasCookie } from 'cookies-next';

const GET_PRODUCTS = gql`
query getProducts{
  getProducts{
    id
    nombre
    precio
    stock
  }
}`


function Productos() {


  const cookie = hasCookie('session-token')

  //Routing

  const router = useRouter()

  //Apollo query

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'network-only', // La primera vez que se ejecuta la query ignora la caché, ya que es null y si no se indica esta opción, no mostrará resultados
    nextFetchPolicy: 'cache-first', // A partir de la segunda vez vuelve a su estado default que es primero leer si hay datos en caché
  })

  useEffect(() => {

    //if no data
  
    if (!cookie) {
      return router.push('/login')
    }
  }, [])
  return (
    <>
      {loading ? <p className='text-2xl text-gray-800 font-light'>Cargando...</p> :    
      <>
      <Header />
      <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>

    <Link href='/newProduct'>
      <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">Nuevo Producto</p>
    </Link>



        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Precio (€)</th>
              <th className='w-1/5 py-2'>Stock (uds)</th>
              <th className='w-1/5 py-2'></th>
              <th className='w-1/5 py-2'></th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {/* {data.getClientsSeller.map(cliente => (
              <Client key={cliente.id} cliente={cliente} />))} */}
            {data.getClientsSeller !== null? data.getProducts.map(producto => (
              <Product key={producto.id} producto={producto} />
            )):null}
          </tbody>
        </table>
        </>}
    </>

  )
}

export default Productos