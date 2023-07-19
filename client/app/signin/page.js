'use client'

import React from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'

function SignIn() {


    //Form validation

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email:'',
            password:''
        },
        onSubmit: values => {
            console.log(values);
        }
    })

  return (
    <section className='min-h-screen flex flex-col justify-center w-screen'>
    <h1 className='text-center'>Sign In</h1>
    <div className='flex justify-center'>
        <div className=' w-full max-w-sm'>
            <form   className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={formik.handleSubmit}>
            <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>Nombre</label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                        id='name'
                        type='text'
                        placeholder='John' 
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='surname'>Apellido</label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                        id='surname'
                        type='text'
                        placeholder='Doe'
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                         />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                        id='email'
                        type='email'
                        placeholder='abc@mail.com'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>Password</label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                        id='password'
                        type='password'
                        placeholder='1234abcde'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                         />
                </div>
                <input
                    type='submit'
                    className='bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                    value='enter'
                />
            </form>
        </div>

    </div>
</section>
  )
}

export default SignIn