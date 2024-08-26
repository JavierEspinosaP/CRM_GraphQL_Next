'use-client'

import { useState, useEffect, useContext } from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import OrderContext from '@/app/context/pedidos/ordersContext'

// GraphQL query to get clients associated with the seller
const GET_CLIENTS_SELLER = gql`
query getClientsSeller {
  getClientsSeller {
    nombre
    apellido
    empresa
    email
    id
  }
}`

function AssignClient() {

    const [client, setClient] = useState([]) // State to hold the selected client

    // Access the order context to add the selected client to the order
    const orderContext = useContext(OrderContext)
    const { addClient } = orderContext
    
    // Query to fetch clients from the database
    const { data, loading, error } = useQuery(GET_CLIENTS_SELLER);

    // Update the context with the selected client whenever it changes
    useEffect(() => {
        addClient(client)
    }, [client]) // `addClient` is not added as a dependency to avoid unnecessary re-renders

    // Handler to update the selected client state
    const selectClient = client => {
        setClient(client)
    }

    // Handle loading state, return null if the query is still loading
    if (loading) return null

    // Destructure the result to get the list of clients
    const { getClientsSeller } = data

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                1.- Assign a client to the order
            </p>
            <Select
                className='mt-3'
                options={getClientsSeller} 
                isMulti={false}
                onChange={(option) => selectClient(option)} 
                getOptionValue={options => options.id} 
                getOptionLabel={options => options.nombre} 
                placeholder="Search or select a client"
                noOptionsMessage={() => "No results found"} 
            />
        </>
    )
}

export default AssignClient
