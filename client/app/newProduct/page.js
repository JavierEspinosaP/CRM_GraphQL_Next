'use client'

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useFormik } from 'formik';
import { gql, useMutation, useQuery } from '@apollo/client';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { hasCookie } from 'cookies-next';

// GraphQL mutation to create a new product
const NEW_PRODUCT = gql`
  mutation newProduct($input: ProductInput) {
    newProduct(input: $input) {
      id
      nombre
      stock
      precio
    }
  }
`;

// GraphQL query to get all products
const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      nombre
      stock
      precio
    }
  }
`;

function NewProduct() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [colour, setColour] = useState('bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cookie = isClient ? hasCookie('session-token') : false;

  useEffect(() => {
    if (isClient && !cookie) {
      router.push('/login');
    }
  }, [isClient, cookie, router]);

  // Use the GET_PRODUCTS query to fetch existing products
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    skip: !isClient || !cookie, // Skip the query if not client or no cookie
  });

  // Use the newProduct mutation to add a new product
  const [newProduct] = useMutation(NEW_PRODUCT);

  // Initialize formik for form handling
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      stock: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('El nombre es obligatorio')
        .min(2, 'El nombre debe ser de al menos 6 caracteres'),
      price: Yup.string()
        .required('El precio es obligatorio')
        .test(
          'no-comma',
          'Los decimales deben escribirse con punto "." en vez de coma ","',
          (value) => !value.includes(',')
        )
        .matches(/^(\d)*(\.)?([0-9]{2})?$/, 'El precio no es válido'),
      stock: Yup.string()
        .required('El stock es obligatorio')
        .matches(/^(\d)*(\.)?([0-9]{2})?$/, 'El stock no es válido'),
    }),
    onSubmit: async (values) => {
      const { name, price, stock } = values;

      try {
        const productExists = data?.getProducts.some(
          (product) => product.nombre.toLowerCase() === name.toLowerCase()
        );

        if (productExists) {
          setColour('bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto');
          setMessage('El nombre del producto ya ha sido registrado anteriormente');
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          return;
        }

        const { data: newProductData } = await newProduct({
          variables: {
            input: {
              nombre: name,
              precio: Number(price),
              stock: Number(stock),
            },
          },
        });

        setColour('bg-green-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto');
        setMessage(`Producto ${newProductData.newProduct.nombre} creado correctamente`);
        setTimeout(() => {
          setMessage(null);
          router.push('/productos');
        }, 3000);
      } catch (error) {
        console.error(error);
        setColour('bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto');
        setMessage('El nombre del producto ya ha sido registrado anteriormente');
        setTimeout(() => {
          setMessage(null);
        }, 1000);
      }
    },
  });

  const showMessage = () => (
    <div className={colour}>
      <p>{message}</p>
    </div>
  );

  // Avoid rendering the form until the client is confirmed and data is loaded
  if (!isClient || !cookie || loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Header />

      <h1 className="text-2xl text-gray-800 font-light text-center mt-10">Crear Nuevo Producto</h1>

      {message && showMessage()}

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-lg">
          <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="name"
                type="text"
                placeholder="Introduce nombre de producto"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.name}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Precio
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="price"
                type="text"
                placeholder="Introduce precio en €"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
              {formik.touched.price && formik.errors.price && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.price}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                Stock
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="stock"
                type="text"
                placeholder="Introduce número de unidades"
                value={formik.values.stock}
                onChange={formik.handleChange}
              />
              {formik.touched.stock && formik.errors.stock && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.stock}</p>
                </div>
              )}
            </div>

            <input
              type="submit"
              className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
              value="Crear"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default NewProduct;
