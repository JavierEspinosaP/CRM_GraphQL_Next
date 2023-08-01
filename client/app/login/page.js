'use client'

import React from 'react'

import { useFormik } from 'formik';
import * as Yup from 'yup';

function Login() {

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                        .email('Invalid email')
                        .required('Email should not be empty'),
            password: Yup.string()
                            .required('Password is required')
        }),
        onSubmit: values => {
            console.log(values);
        }
    })
    return (
        <section className='min-h-screen flex flex-col justify-center w-screen'>
            <h1 className='text-center'>Login</h1>
            <div className='flex justify-center'>
                <div className=' w-full max-w-sm'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='email'
                                type='email'
                                placeholder='abc@mail.com'
                                onChange={formik.handleChange}
                                value={formik.values.email} />
                        </div>

                        {formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>Password</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='password'
                                type='password'
                                placeholder='1234abcde'
                                onChange={formik.handleChange}
                                value={formik.values.password} />
                        </div>

                        {formik.touched.password && formik.errors.password ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.password}</p>
                            </div>
                        ) : null}

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

export default Login