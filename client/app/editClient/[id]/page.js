"use client";

import { useState } from "react";

import Header from "../../components/Header";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { hasCookie } from "cookies-next";

const UPDATE_CLIENT = gql`
  mutation updateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id, input: $input) {
      nombre
      email
    }
  }
`;

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
  const clientID = useParams();

  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: {
      id: clientID.id,
    },
  });

  //Update client

  const [updateClient] = useMutation(UPDATE_CLIENT);

  //Validation schema

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

  if (loading) {
    return "Cargando...";
  }

  const { getClient } = data;

  //Function that update client on db

  const updateClientInfo = async (values) => {
    const { nombre, apellido, empresa, email, telefono } = values;

    try {
      const { data } = await updateClient({
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
        refetchQueries: [{ query: GET_CLIENT, variables: { id: clientID.id } }], // Refresca la consulta después de la mutación
      });
      //Alert
      Swal.fire("Cliente actualizado", "", "success");
      //Back to home
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

      <section className="min-h-screen flex flex-col justify-center w-screen">
        <h1 className="text-center">Edit Client</h1>
        <div className="flex justify-center">
          <div className=" w-full max-w-sm">
            <Formik
              validationSchema={validationSchema}
              enableReinitialize
              initialValues={getClient}
              onSubmit={(values) => {
                updateClientInfo(values);
              }}
            >
              {(props) => {
                return (
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
                        placeholder="John"
                        value={props.values.nombre}
                        onChange={props.handleChange}
                        // onBlur={props.handleBlur}
                      />
                    </div>

                    {props.touched.nombre && props.errors.nombre ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                        <p>{props.errors.nombre}</p>
                      </div>
                    ) : null}

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="surname"
                      >
                        Apellido
                      </label>
                      <input
                        name="apellido"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                        id="surname"
                        type="text"
                        placeholder="Doe"
                        value={props.values.apellido}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                      />
                    </div>

                    {props.touched.apellido && props.errors.apellido ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                        <p>{props.errors.apellido}</p>
                      </div>
                    ) : null}

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
                        // onBlur={formik.handleBlur}
                      />
                    </div>

                    {props.touched.email && props.errors.email ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                        <p>{props.errors.email}</p>
                      </div>
                    ) : null}

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="company"
                      >
                        Empresa
                      </label>
                      <input
                        name="empresa"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                        id="company"
                        type="text"
                        placeholder="Company Name"
                        value={props.values.empresa}
                        onChange={props.handleChange}
                      />
                    </div>
                    {props.touched.empresa && props.errors.empresa ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                        <p>{props.errors.company}</p>
                      </div>
                    ) : null}
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="phone"
                      >
                        Teléfono
                      </label>
                      <input
                        name="telefono"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                        id="phone"
                        type="tel"
                        placeholder="1234567890"
                        value={props.values.telefono}
                        onChange={props.handleChange}
                      />
                    </div>
                    {props.touched.phone && props.errors.phone ? (
                      <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                        <p>{props.errors.phone}</p>
                      </div>
                    ) : null}

                    <input
                      type="submit"
                      className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                      value="create"
                    />
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditClient;
