import React from 'react'

import Link from 'next/link'
import Header from '../components/Header';

function Pedidos() {
  return (<>
    <Header />
    <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
    <Link href='/newOrder'>
      <p className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-400 uppercase font-bold">Nuevo Pedido</p>
    </Link>
  </>

  )
}

export default Pedidos