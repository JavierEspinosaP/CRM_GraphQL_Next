'use client'

import { gql, useQuery } from '@apollo/client'

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

  //Apollo query

  const { data, loading, error } = useQuery(GET_CLIENTS_SELLER)

  return (
    <>
    <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>

    {data?<table className='table-auto shadow-md mt-10 w-full w-lg'>
      <thead className='bg-gray-800'>
        <tr className='text-white'>
          <th className='w-1/5 py-2'>Nombre</th>
          <th className='w-1/5 py-2'>Empresa</th>
          <th className='w-1/5 py-2'>Email</th>
        </tr>
        </thead>
        <tbody className='bg-white'>
          {data.getClientsSeller.map(cliente => (
            <tr key={cliente.id}>
              <td className='border px-4 py-2'>{cliente.nombre} {cliente.apellido}</td>
              <td className='border px-4 py-2'>{cliente.empresa}</td>
              <td className='border px-4 py-2'>{cliente.email}</td>
            </tr>
          ))}
        </tbody>
        </table>:<></>}  
    </>

  )
}
export default Index