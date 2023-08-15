'use client'

import { gql, useQuery } from '@apollo/client'
import Header from './components/Header';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const GET_CLIENTS_SELLER = gql`
query getClientsSeller{
  getClientsSeller{
    nombre
    apellido
    empresa
    email
  }
}`

const Index = () => {

  //Routing

  const router = useRouter()

  //Apollo query

  const { data, loading, error } = useQuery(GET_CLIENTS_SELLER)

  if (loading) {
    return 'Cargando'
  }

  //if no data

  if (!data) {
    return router.push('/login')
  }

  return (
    <>
      <Header />
      <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>

    <Link href='/newClient'>
      <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">Nuevo Cliente</p>
    </Link>
      {loading ? <p className='text-2xl text-gray-800 font-light'>Cargando...</p> :


        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2'>Nombre</th>
              <th className='w-1/5 py-2'>Empresa</th>
              <th className='w-1/5 py-2'>Email</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.getClientsSeller !== null? data.getClientsSeller.map(cliente => (
              <tr key={cliente.id}>
                <td className='border px-4 py-2'>{cliente.nombre} {cliente.apellido}</td>
                <td className='border px-4 py-2'>{cliente.empresa}</td>
                <td className='border px-4 py-2'>{cliente.email}</td>
              </tr>
            )):null}
          </tbody>
        </table>}
    </>

  )
}
export default Index