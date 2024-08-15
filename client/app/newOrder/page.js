'use client'
import React, {useContext} from 'react'
import AssignClient from '../components/orders/AssignClient'
import AssignProduct from '../components/orders/AssignProduct'

//Order context

import OrderContext from '../context/pedidos/ordersContext'

function NewOrder() {

  // Use Context and extract its values

  const orderContext = useContext(OrderContext)
  

  return (<>
    <h1 className="text-2xl text-gray-800 font-light">Create new order</h1>

    <AssignClient/>
    <AssignProduct/>


  </>

  )
}

export default NewOrder