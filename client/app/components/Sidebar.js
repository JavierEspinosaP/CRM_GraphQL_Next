"use client"

import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

function Sidebar() {


  //routing next

  const router = usePathname()


  return (
    <>
    {router === '/login' || router === '/signin' ? <></> : 
        <aside >
        <div className='bg-gray-800 min-h-screen p-5'>
          <p className='text-white text-2xl font-black'>CRM CLIENTS</p>
          <nav className='mt-5 list-none'>
          <li className={router === '/' ? 'bg-blue-800 p-1' : 'p-1'}>
            <Link href='/'>
              <p className='text-white'>Clientes</p>
              </Link> 
          </li>
          <li className={router === '/pedidos' ? 'bg-blue-800 p-1' : 'p-1'}>
            <Link href='/pedidos'>
              <p className='text-white'>Pedidos</p>
            </Link> 
          </li>
          <li className={router === '/productos' ? 'bg-blue-800 p-1' : 'p-1'}>
            <Link href='/productos'>
              <p className='text-white'>Productos</p>
            </Link> 
          </li>
        </nav>
        </div>
      </aside>}

    </>
  )
}

export default Sidebar
