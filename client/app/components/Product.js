import React from 'react'
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      nombre
      stock
      precio
    }
  }
`

function Product({ producto }) {
  // Routing
  const router = useRouter()

  // delete product mutation
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      // Get a copy of cache object
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS })

      // Rewrite cache
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: getProducts.filter(currentProduct => currentProduct.id !== producto.id)
        }
      })
    }
  })

  const { id, nombre, precio, stock } = producto

  // Delete Product
  const deleteProductModal = () => {
    Swal.fire({
      title: '¿Deseas eliminar este producto?',
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
          // Delete by ID
          await deleteProduct({
            variables: { id }
          })

          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado',
            'success'
          )
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  // edit product
  const editProductModal = () => {
    router.push(`/editProduct/${id}`)
  }

  return (
    <tr className="md:table-row block md:mb-0 bg-white shadow-md rounded-lg border md:border-0">
      {/* Encabezado para pantallas pequeñas */}
      <td colSpan={4} className="block md:hidden bg-gray-800 text-white font-bold px-4 py-2 rounded-t-lg">
        Producto: {nombre}
      </td>

      <td className="border px-4 py-2 md:table-cell block">
        <span className="block md:hidden font-bold">Nombre: </span>
        {nombre}
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <span className="block md:hidden font-bold">Precio: </span>
        {precio} €
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <span className="block md:hidden font-bold">Stock: </span>
        {stock} uds
      </td>
      <td className="border px-4 py-2 md:table-cell block">
        <div className="flex justify-end mt-4 md:mt-0 space-x-2">
          <button
            type="button"
            className="flex justify-center items-center bg-red-700 h-8 py-1 px-4 text-white rounded text-xs uppercase font-bold hover:bg-red-900 max-w-xs"
            onClick={() => deleteProductModal(id)}
          >
            Eliminar
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            className="flex justify-center items-center bg-yellow-700 h-8 py-1 px-4 text-white rounded text-xs uppercase font-bold hover:bg-yellow-900 max-w-xs"
            onClick={() => editProductModal()}
          >
            Editar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default Product
