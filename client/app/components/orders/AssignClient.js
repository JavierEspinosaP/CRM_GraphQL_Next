'use-client'

import {useState, useEffect, useContext} from 'react'
import Select from 'react-select'
import {gql, useQuery} from '@apollo/client'
import OrderContext from '@/app/context/pedidos/ordersContext'

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



function AssignClient() {

    const [client, setClient] = useState([])

    // Orders context

    const orderContext = useContext(OrderContext)
    const {addClient} = orderContext
    

    //Query clients from database

    const { data, loading, error } = useQuery(GET_CLIENTS_SELLER);

    // console.log(data, loading, error);
    

    useEffect(() => {
        addClient(client)
    }, [client])

    const selectClient = client => {
        setClient(client)
    }

    //Results of query

    if(loading) return null

    const { getClientsSeller} = data

    // console.log(getClientsSeller);
    


    return (<>
    <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un cliente al pedido</p>
        <Select
            className='mt-3'
            options={getClientsSeller}
            isMulti={false}
            onChange={(option) => selectClient(option)}
            getOptionValue={options => options.id}
            getOptionLabel={options => options.nombre}
            placeholder= "Busque o seleccione el cliente"
            noOptionsMessage={() => "No hay resultados"} />
    </>

    )
}

export default AssignClient