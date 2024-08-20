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

  const router = useRouter()

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })

  useEffect(() => {
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
          <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">
            Nuevo Producto
          </p>
        </Link>

        <div className='overflow-x-auto'>
          <table className='table-auto shadow-md mt-10 w-full'>
            <thead className='bg-gray-800 md:table-header-group hidden'>
              <tr className='text-white'>
                <th className='w-1/5 py-2'>Nombre</th>
                <th className='w-1/5 py-2'>Precio (€)</th>
                <th className='w-1/5 py-2'>Stock (uds)</th>
                <th className='w-1/5 py-2'></th>
              </tr>
            </thead>
            <tbody className='bg-white block md:table-row-group'>
              {data.getProducts !== null ? data.getProducts.map(producto => (
                <Product key={producto.id} producto={producto} />
              )) : null}
            </tbody>
          </table>
        </div>
      </>}
    </>
  )
}

export default Productos
