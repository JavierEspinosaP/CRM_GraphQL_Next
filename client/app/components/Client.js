import React from 'react'
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'

// GraphQL mutation to delete a client by ID
const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`

// GraphQL query to get the list of clients associated with the seller
const GET_CLIENTS_SELLER = gql`
  query getClientsSeller {
    getClientsSeller {
      nombre
      apellido
      empresa
      email
      id
    }
  }
`

function Client({ cliente }) {
  const router = useRouter()

  // Mutation to delete a client, with cache update to remove the client from the list
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      const { getClientsSeller } = cache.readQuery({ query: GET_CLIENTS_SELLER })

      cache.writeQuery({
        query: GET_CLIENTS_SELLER,
        data: {
          getClientsSeller: getClientsSeller.filter(currentClient => currentClient.id !== cliente.id)
        }
      })
    }
  })

  const { id, nombre, apellido, email, empresa } = cliente

  // Function to handle client deletion with a confirmation modal
  const deleteClientModal = () => {
    Swal.fire({
      title: 'Do you want to delete this client?',
      text: "This action cannot be undone",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete client',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.value) {
        try {
          // Delete client by ID
          await deleteClient({
            variables: { id }
          })

          Swal.fire(
            'Deleted',
            'The client has been deleted',
            'success'
          )
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  // Function to handle client edit redirection
  const editClientModal = () => {
    router.push(`/editClient/${id}`)
  }

  return (
    <tr className="md:table-row block md:mb-0 bg-white shadow-md rounded-lg border md:border-0">
      <td colSpan={4} className="block md:hidden bg-gray-800 text-white font-bold px-4 py-2 rounded-t-lg">
        Client: {nombre} {apellido}
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <span className="block md:hidden font-bold">Name: </span>
        {nombre} {apellido}
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <span className="block md:hidden font-bold">Company: </span>
        {empresa}
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <span className="block md:hidden font-bold">Email: </span>
        {email}
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <div className="flex justify-end mt-4 md:mt-0 space-x-2">
          <button
            type="button"
            className="flex justify-center items-center bg-red-700 h-8 py-1 px-4 text-white rounded text-xs uppercase font-bold hover:bg-red-900 max-w-xs"
            onClick={deleteClientModal}
          >
            Delete
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            className="flex justify-center items-center bg-yellow-700 h-8 py-1 px-4 text-white rounded text-xs uppercase font-bold hover:bg-yellow-900 max-w-xs"
            onClick={editClientModal}
          >
            Edit
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Client
