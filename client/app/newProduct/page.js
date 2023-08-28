'use client'

import { useState, useEffect } from 'react'

import Header from '../components/Header';
import { useFormik } from 'formik'
import { gql, useMutation, useQuery } from '@apollo/client'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

const NEW_PRODUCT = gql`
mutation newProduct ($input: ProductInput) {
    newProduct(input: $input) {
        id
        nombre
        stock
        precio
    }
}`

const GET_PRODUCTS = gql`
query getProducts{
  getProducts{
        id
        nombre
        stock
        precio
  }
}`

function newProduct() {

    const [dataProducts, setDataProducts] = useState([])

    //Mutation create new client

    const [newProduct] = useMutation(NEW_PRODUCT)

    //Query to know if product exists

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    useEffect(() => {
      setDataProducts(data)
    }, [data])
    

    //Routing

    const router = useRouter()


    const [message, setMessage] = useState(null)
    const [colour, setColour] = useState('bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto')


    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            stock: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('El nombre es obligatorio').min(2, 'El nombre debe ser de al menos 6 caracteres'),
            price: Yup.string()
                .required('El precio es obligatorio')
                .test('no-comma', 'Los decimales deben escribirse con punto "." en vez de coma ","', value => !value.includes(','))
                .matches(/^(\d)*(\.)?([0-9]{2})?$/, 'El precio no es válido'),
            stock: Yup.string()
                .required('El stock es obligatorio')
                .matches(/^(\d)*(\.)?([0-9]{2})?$/, 'El stock no es válido'),
        }),
        onSubmit: async values => {

            const { name, price, stock } = values;

            try {

                //Check if product already exists
                const productExists = dataProducts?.getProducts.some(product => product.nombre.toLowerCase() === name.toLowerCase());

                if (productExists) {
                    setColour('bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto');
                    setMessage('El nombre del producto ya ha sido registrado anteriormente');
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                    return;
                }

                const { data } = await newProduct({
                    variables: {
                        input: {
                            nombre: name,
                            precio: Number(price),
                            stock: Number(stock)
                        }
                    }

                })
                console.log(data);
                setColour('bg-green-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto')
                setMessage(`Product ${data.newProduct.nombre} created successfully`)
                setTimeout(() => {
                    setMessage(null)
                    router.push('/productos')
                }, 3000);
            } catch (error) {
                console.log(error);
                setColour('bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto')

                setMessage('El nombre del producto ya ha sido registrado anteriormente')

                setTimeout(() => {
                    setMessage(null)
                }, 1000);
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

    return (<>
        <Header />

        <section className='min-h-screen flex flex-col justify-center w-screen'>
            {message && showMessage()}
            <h1 className='text-center'>Create New Product</h1>
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
                                placeholder='Introduce nombre de producto'
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
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='surname'>Precio</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='price'
                                type='text'
                                placeholder='Introduce precio en €'
                                value={formik.values.price}
                                onChange={formik.handleChange}
                            // onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.price && formik.errors.price ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.price}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>Stock</label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2'
                                id='stock'
                                type='text'
                                placeholder='Introduce número de unidades'
                                value={formik.values.stock}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.touched.stock && formik.errors.stock ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2'>
                                <p>{formik.errors.stock}</p>
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
        </section>
    </>

    )
}

export default newProduct