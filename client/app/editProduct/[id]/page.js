"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { hasCookie } from "cookies-next";

// GraphQL mutation to update a product's information
const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: ProductInput) {
    updateProduct(id: $id, input: $input) {
      nombre
      precio
      stock
    }
  }
`;

// GraphQL query to fetch a product's details based on its ID
const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      nombre
      precio
      stock
    }
  }
`;

function EditProduct() {
  // State to track if the component is rendered on the client
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const productID = useParams();

  // Effect to set the isClient state to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if the session cookie exists
  const cookie = isClient ? hasCookie("session-token") : false;

  // Redirect to the login page if the session cookie is not found
  useEffect(() => {
    if (isClient && !cookie) {
      router.push("/login");
    }
  }, [isClient, cookie, router]);

  // Execute the GraphQL query only if the component is rendered on the client
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      id: productID.id,
    },
    skip: !isClient, // Skip the query until we're sure it's the client
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  // Validation schema for the product form using Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe ser de al menos 2 caracteres"),
    precio: Yup.number()
      .required("El precio es obligatorio")
      .positive("El precio debe ser un número positivo")
      .typeError("El precio debe ser un número"),
    stock: Yup.number()
      .required("El stock es obligatorio")
      .positive("El stock debe ser un número positivo")
      .integer("El stock debe ser un número entero")
      .typeError("El stock debe ser un número"),
  });

  // Display loading message if the data is being fetched
  if (!isClient || loading) {
    return <p>Cargando...</p>;
  }
  // Display an error message if there was an issue fetching the data
  if (error) {
    return <p>Error al cargar el producto.</p>;
  }

  const { getProduct } = data;

  // Function to handle the form submission and update the product's info
  const updateProductInfo = async (values) => {
    const { nombre, precio, stock } = values;

    try {
      await updateProduct({
        variables: {
          id: productID.id,
          input: {
            nombre,
            precio: Number(precio),
            stock: Number(stock),
          },
        },
        refetchQueries: [
          { query: GET_PRODUCT, variables: { id: productID.id } },
        ],
      });
      Swal.fire("Producto actualizado", "", "success");
      setTimeout(() => {
        router.push("/productos");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm px-4 sm:px-0 mx-auto">
          <h1 className="text-center mb-4">Edit Product</h1>
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={getProduct}
            onSubmit={(values) => {
              updateProductInfo(values);
            }}
          >
            {(props) => (
              <form
                className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                onSubmit={props.handleSubmit}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="name"
                    type="text"
                    placeholder="Nombre del producto"
                    value={props.values.nombre}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  {props.touched.nombre && props.errors.nombre ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.nombre}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="precio"
                  >
                    Precio
                  </label>
                  <input
                    name="precio"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="precio"
                    type="text"
                    placeholder="Introduce el precio con dos decimales"
                    value={props.values.precio}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  {props.touched.precio && props.errors.precio ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.precio}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="stock"
                  >
                    Stock
                  </label>
                  <input
                    name="stock"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="stock"
                    type="number"
                    placeholder="Cantidad en stock"
                    value={props.values.stock}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  />
                  {props.touched.stock && props.errors.stock ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.stock}</p>
                    </div>
                  ) : null}
                </div>

                <input
                  type="submit"
                  className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                  value="Guardar"
                />
              </form>
            )}
          </Formik>
        </div>
      </section>
    </>
  );
}

export default EditProduct;
