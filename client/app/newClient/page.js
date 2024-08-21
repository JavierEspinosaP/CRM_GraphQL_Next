'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header';
import { useFormik } from 'formik'
import { gql, useMutation } from '@apollo/client'
import * as Yup from 'yup'
import {useRouter} from 'next/navigation';
import { hasCookie } from "cookies-next";

const NEW_CLIENT = gql`
mutation newClient ($input: ClientInput) {
    newClient(input: $input) {
        id
        nombre
        apellido
        empresa
        email
        telefono
    }
}`

const GET_CLIENTS_SELLER = gql`
query getClientsSeller{
  getClientsSeller{
    nombre
    apellido
    empresa
    email
  }
}`

function NewClient() {
    const cookie = hasCookie("session-token");

    const router = useRouter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (!cookie) {
        return router.push("/login");
      }
    }, []);
  
    if (!cookie) {
      // Evita el renderizado hasta que se complete el redireccionamiento
      return null;
    }

    const [newClient] = useMutation(NEW_CLIENT)

    const [message, setMessage] = useState(null)
    const [colour, setColour] = useState('bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto')

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            company: '',
            phone: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('El nombre es obligatorio').min(2, 'El nombre debe ser de al menos 6 caracteres'),
            surname: Yup.string()
                .required('El apellido es obligatorio').min(2, 'El apellido debe ser de al menos 6 caracteres'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
            company: Yup.string().required('La empresa es obligatoria'),
            phone: Yup.string().matches(/^(\+\d{1,3}[- ]?)?\d{9}$/, 'El teléfono no es válido'),
        }),
        onSubmit: async values => {

            const { name, surname, email, company, phone } = values;

            try {
                const { data } = await newClient({
                    variables: {
                        input: {
                            nombre: name,
                            apellido: surname,
                            empresa: company,
                            email,
                            telefono: phone
                        }
                    }
                })

                setColour('bg-green-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto')
                setMessage(`User ${data.newClient.nombre} created successfully`)
                setTimeout(() => {
                    setMessage(null)
                    router.push('/')
                }, 3000);
            } catch (error) {
                setColour('bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto')

                setMessage('El email del cliente ya ha sido registrado anteriormente')

                setTimeout(() => {
                    setMessage(null)
                }, 2000);
            }
        }
    })

    const showMessage = () => {
        return (
            <div className={colour}>
                <p>{message}</p>
            </div>
        )
    }

    return (
        <>
            <Header />

            <h1 className="text-2xl text-gray-800 font-light text-center mt-10">Create New Client</h1>

            {message && showMessage()}

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-lg">
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
                            />
                        </div>

                        {formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='company'>Empresa</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='company'
                                type='text'
                                placeholder='Company Name'
                                value={formik.values.company}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.touched.company && formik.errors.company ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.company}</p>
                            </div>
                        ) : null}
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>Teléfono</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='phone'
                                type='tel'
                                placeholder='1234567890'
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.touched.phone && formik.errors.phone ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.phone}</p>
                            </div>
                        ) : null}

                        <input
                            type='submit'
                            className='bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                            value='create'
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default NewClient
