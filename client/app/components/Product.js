import React from 'react'

import Swal from 'sweetalert2'

import { gql, useMutation } from '@apollo/client'

import { useRouter } from 'next/navigation'

const DELETE_PRODUCT = gql`mutation deleteProduct($id: ID!){
  deleteProduct(id:$id)
}
`

const GET_PRODUCTS = gql`
query getProducts{
  getProducts{
        id
        nombre
        stock
        precio
  }
}`




function Product({ producto }) {

  //Routing

const router = useRouter()

  //delete client mutation

  const [deleteClient] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      //Get a copy of cache object
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })

      //Rewrite cache

      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: getProducts.filter(currentProduct => currentProduct.id !== id)
        }
      })
    }
  })

  const { id, nombre, precio, stock } = producto

  //Delete Client

  const deleteClientModal = () => {
    Swal.fire({
      title: 'Deseas eliminar a este producto?',
      text: "Esta acción es irrevocable",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar producto',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.value) {
        try {

          //Delete by ID

          const { data } = await deleteClient({
            variables: {
              id
            }
          })

          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado',
            'success'
          )
        } catch (error) {
          console.log(error);
        }

      }
    })
    console.log('eliminar', id);
  }

  //edit client

  const editClientModal = () => {
    router.push(`/editProduct/${id}`)
  }


  return (
    <tr >
      <td className='border px-4 py-2'>{nombre}</td>
      <td className='border px-4 py-2'>{precio}</td>
      <td className='border px-4 py-2'>{stock}</td>
      <td className='border px-4 py-2'><button
        type='button'
        className='flex justify-center items-center bg-red-700 h-8 py-1 px-2 w-full text-white rounded text-xs uppercase font-bold hover:bg-red-900'
        onClick={() => deleteClientModal(id)}
      >   Eliminar
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        </svg>
      </button></td>
      <td className='border px-4 py-2'><button
        type='button'
        className='flex justify-center items-center bg-yellow-700 h-8 px-2 w-full text-white rounded text-xs uppercase font-bold hover:bg-yellow-900'
        onClick={() => editClientModal()}
      >   Editar
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>

      </button></td>
    </tr>
  )
}

export default Product