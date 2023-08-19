'use client'

import { useState } from 'react'

import Header from '../../components/Header';
import { gql, useQuery, useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { useRouter, useParams } from 'next/navigation'
import { Formik } from 'formik'

const GET_CLIENTS_SELLER = gql`
query getClientsSeller{
  getClientsSeller{
    nombre
    apellido
    empresa
    email
    telefono
  }
}`

const GET_CLIENT = gql`
query getClient($id: ID!){
  getClient(id: $id){
    nombre
    apellido
    email
    telefono
    empresa
  }
}`


function editClient() {

  const clientID = useParams()

  console.log(clientID);

  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id: clientID.id
    }
  })

  console.log(data);

  //Routing

  const router = useRouter()

  if (loading) {
    return 'Cargando...'
  }

  return (<>
    <Header />

    <section className='min-h-screen flex flex-col justify-center w-screen'>
      <h1 className='text-center'>Edit Client</h1>
      <div className='flex justify-center'>
        <div className=' w-full max-w-sm'>
          <Formik

          >
            {props => {
              console.log(props);
              return (


                <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                 onSubmit={props.handleSubmit}
                >
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>Nombre</label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                      id='name'
                      type='text'
                      placeholder='John'
                    // value={formik.values.name}
                     onChange={props.handleChange}
                    // onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* {formik.touched.name && formik.errors.name ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                            <p>{formik.errors.name}</p>
                        </div>
                    ) : null} */}

                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='surname'>Apellido</label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                      id='surname'
                      type='text'
                      placeholder='Doe'
                    // value={formik.values.surname}
                     onChange={props.handleChange}
                    // onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* {formik.touched.surname && formik.errors.surname ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                            <p>{formik.errors.surname}</p>
                        </div>
                    ) : null} */}

                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                      id='email'
                      type='email'
                      placeholder='abc@mail.com'
                    // value={formik.values.email}
                     onChange={props.handleChange}
                    // onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* {formik.touched.email && formik.errors.email ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                            <p>{formik.errors.email}</p>
                        </div>
                    ) : null} */}

                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='company'>Empresa</label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                      id='company'
                      type='text'
                      placeholder='Company Name'
                    // value={formik.values.company}
                     onChange={props.handleChange}
                    />
                  </div>
                  {/* {formik.touched.company && formik.errors.company ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                            <p>{formik.errors.company}</p>
                        </div>
                    ) : null} */}
                  <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>Teléfono</label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                      id='phone'
                      type='tel'
                      placeholder='1234567890'
                    // value={formik.values.phone}
                     onChange={props.handleChange}
                    />
                  </div>
                  {/* {formik.touched.phone && formik.errors.phone ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                            <p>{formik.errors.phone}</p>
                        </div>
                    ) : null} */}

                  <input
                    type='submit'
                    className='bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                    value='create'
                  />
                </form>
              )
            }}
          </Formik>
        </div>

      </div>
    </section>
  </>

  )
}

export default editClient