"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { hasCookie } from "cookies-next";

// GraphQL mutation to update a client's information
const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id, input: $input) {
      nombre
      email
    }
  }
`;

// GraphQL query to get a client's information based on their ID
const GET_CLIENT = gql`
  query getClient($id: ID!) {
    getClient(id: $id) {
      nombre
      apellido
      email
      telefono
      empresa
    }
  }
`;

function EditClient() {
  // State to check if the component is mounted on the client
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const clientID = useParams();

  // Set isClient to true once the component is mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if the session token cookie exists
  const cookie = isClient ? hasCookie("session-token") : false;

  // Redirect to login page if no session cookie is found
  useEffect(() => {
    if (isClient && !cookie) {
      router.push("/login");
    }
  }, [isClient, cookie, router]);

  // Execute the GraphQL query only if the component is on the client side
  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id: clientID.id,
    },
    skip: !isClient, // Skip the query until we're sure it's the client
  });

  const [updateClient] = useMutation(UPDATE_CLIENT);

  // Validation schema for the client form using Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .min(2, "El nombre debe ser de al menos 6 caracteres"),
    apellido: Yup.string()
      .required("El apellido es obligatorio")
      .min(2, "El apellido debe ser de al menos 6 caracteres"),
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    empresa: Yup.string().required("La empresa es obligatoria"),
    telefono: Yup.string().matches(
      /^(\+\d{1,3}[- ]?)?\d{9}$/,
      "El teléfono no es válido"
    ),
  });

  // Show a loading message while the query is in progress
  if (!isClient || loading) {
    return <p>Cargando...</p>;
  }

  // Display an error message if the query fails
  if (error) {
    return <p>Error al cargar el cliente.</p>;
  }

  // Destructure the fetched client data
  const { getClient } = data;

  // Function to handle the form submission and update the client's info
  const updateClientInfo = async (values) => {
    const { nombre, apellido, empresa, email, telefono } = values;

    try {
      await updateClient({
        variables: {
          id: clientID.id,
          input: {
            nombre,
            apellido,
            empresa,
            email,
            telefono,
          },
        },
        refetchQueries: [{ query: GET_CLIENT, variables: { id: clientID.id } }],
      });
      Swal.fire("Cliente actualizado", "", "success");
      setTimeout(() => {
        router.push("/");
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
          <h1 className="text-center mb-4">Edit Client</h1>
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={getClient}
            onSubmit={(values) => {
              updateClientInfo(values);
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
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                  <input
                    name="nombre"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="nombre"
                    type="text"
                    placeholder="John"
                    value={props.values.nombre}
                    onChange={props.handleChange}
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
                    htmlFor="apellido"
                  >
                    Apellido
                  </label>
                  <input
                    name="apellido"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="apellido"
                    type="text"
                    placeholder="Doe"
                    value={props.values.apellido}
                    onChange={props.handleChange}
                  />
                  {props.touched.apellido && props.errors.apellido ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.apellido}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="email"
                    type="email"
                    placeholder="abc@mail.com"
                    value={props.values.email}
                    onChange={props.handleChange}
                  />
                  {props.touched.email && props.errors.email ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.email}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="empresa"
                  >
                    Empresa
                  </label>
                  <input
                    name="empresa"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="empresa"
                    type="text"
                    placeholder="Company Name"
                    value={props.values.empresa}
                    onChange={props.handleChange}
                  />
                  {props.touched.empresa && props.errors.empresa ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.empresa}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="telefono"
                  >
                    Teléfono
                  </label>
                  <input
                    name="telefono"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                    id="telefono"
                    type="tel"
                    placeholder="1234567890"
                    value={props.values.telefono}
                    onChange={props.handleChange}
                  />
                  {props.touched.telefono && props.errors.telefono ? (
                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
                      <p>{props.errors.telefono}</p>
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

export default EditClient;
