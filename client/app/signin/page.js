'use client'

import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";


const NEW_ACCOUNT = gql`
mutation newUser($input: UserInput) {
    newUser(input: $input) {
        id
        nombre
        apellido
        email
    }
}`

function SignIn() {

    //Get products of GraphQL

    const [newUser] = useMutation(NEW_ACCOUNT)


    //Form validation

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('El nombre es obligatorio'),
            surname: Yup.string()
                .required('El apellido es obligatorio'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
            password: Yup.string()
                .required('El password no puede estar vacío')
                .min(6, 'El password debe ser de al menos 6 caracteres')
        }),
        onSubmit: async values => {

            const { name, surname, email, password } = values;

            try {
                const {data} = await newUser({
                    variables: {
                        input: {
                            nombre: name,
                            apellido: surname,
                            email,
                            password
                        }
                    }

                })
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
    })


    return (
        <section className='min-h-screen flex flex-col justify-center w-screen'>
            <h1 className='text-center'>Sign In</h1>
            <div className='flex justify-center'>
                <div className=' w-full max-w-sm'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
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
                            // onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.name && formik.errors.name ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.name}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='surname'>Apellido</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='surname'
                                type='text'
                                placeholder='Doe'
                                value={formik.values.surname}
                                onChange={formik.handleChange}
                            // onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.surname && formik.errors.surname ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.surname}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='email'
                                type='email'
                                placeholder='abc@mail.com'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            // onBlur={formik.handleBlur}
                            />
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
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            // onBlur={formik.handleBlur}
                            />
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

export default SignIn