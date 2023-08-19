'use client'

import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client'
import Header from './components/Header';
import Client from './components/Client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { hasCookie } from 'cookies-next';

const GET_CLIENTS_SELLER = gql`
query getClientsSeller{
  getClientsSeller{
    nombre
    apellido
    empresa
    email
    id
  }
}`

const Index = () => {

  const cookie = hasCookie('session-token')

  //Routing

  const router = useRouter()

  //Apollo query

  const { data, loading, error } = useQuery(GET_CLIENTS_SELLER, {
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
      <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>

    <Link href='/newClient'>
      <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">Nuevo Cliente</p>
    </Link>



        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Empresa</th>
              <th className='w-1/5 py-2'>Email</th>
              <th className='w-1/5 py-2'></th>
              <th className='w-1/5 py-2'></th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {/* {data.getClientsSeller.map(cliente => (
              <Client key={cliente.id} cliente={cliente} />))} */}
            {data.getClientsSeller !== null? data.getClientsSeller.map(cliente => (
              <Client key={cliente.id} cliente={cliente} />
            )):null}
          </tbody>
        </table>
        </>}
    </>

  )
}
export default Index