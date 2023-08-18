import React from 'react'

import Swal from 'sweetalert2'

import { gql, useMutation } from '@apollo/client'

const DELETE_CLIENT = gql`mutation deleteClient($id: ID!){
  deleteClient(id:$id)
}
`

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

function Client({ cliente }) {

  //delete client mutation

  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache){
      //Get a copy of cache object
      const {getClientsSeller} = cache.readQuery({query: GET_CLIENTS_SELLER})

      //Rewrite cache

      cache.writeQuery({
        query: GET_CLIENTS_SELLER,
        data: {
          getClientsSeller: getClientsSeller.filter( currentClient => currentClient.id !== id)
        }})
    }
  })

  const { id, nombre, apellido, email, empresa } = cliente

  //Delete Client

  const deleteClientModal = id => {
    Swal.fire({
      title: 'Deseas eliminar a este cliente?',
      text: "Esta acción es irrevocable",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar cliente',
      cancelButtonText: 'Cancelar'
    }).then( async (result) => {
      if (result.value) {
        try {

          //Delete by ID

          const {data} = await deleteClient({
            variables: {
              id
            }
          })

          Swal.fire(
            'Eliminado',
            'El cliente ha sido eliminado',
            'success'
          )
        } catch (error) {
          console.log(error);
        }

      }
    })
    console.log('eliminar', id);
  }


  return (
    <tr >
      <td className='border px-4 py-2'>{nombre} {apellido}</td>
      <td className='border px-4 py-2'>{empresa}</td>
      <td className='border px-4 py-2'>{email}</td>
      <td className='border px-4 py-2'><button
        type='button'
        className='flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold hover:bg-red-900'
        onClick={() => deleteClientModal(id)}
      >   Eliminar
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      </button></td>
    </tr>
  )
}

export default Client