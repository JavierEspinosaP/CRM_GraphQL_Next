"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useFormik } from "formik";
import { gql, useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { hasCookie } from "cookies-next";

// GraphQL mutation to create a new client
const NEW_CLIENT = gql`
  mutation newClient($input: ClientInput) {
    newClient(input: $input) {
      id
      nombre
      apellido
      empresa
      email
      telefono
    }
  }
`;

function NewClient() {
  // State to track if the component is being rendered on the client side
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [colour, setColour] = useState(
    "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
  );

  // Set isClient to true once the component is mounted on the client side
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

  // Apollo mutation hook to execute the newClient mutation
  const [newClient] = useMutation(NEW_CLIENT);

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      company: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("El nombre es obligatorio")
        .min(2, "El nombre debe ser de al menos 6 caracteres"),
      surname: Yup.string()
        .required("El apellido es obligatorio")
        .min(2, "El apellido debe ser de al menos 6 caracteres"),
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      company: Yup.string().required("La empresa es obligatoria"),
      phone: Yup.string().matches(
        /^(\+\d{1,3}[- ]?)?\d{9}$/,
        "El teléfono no es válido"
      ),
    }),
    onSubmit: async (values) => {
      const { name, surname, email, company, phone } = values;

      try {
        const { data } = await newClient({
          variables: {
            input: {
              nombre: name,
              apellido: surname,
              empresa: company,
              email,
              telefono: phone,
            },
          },
        });

        setColour(
          "bg-green-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
        );
        setMessage(`User ${data.newClient.nombre} creado correctamente`);
        setTimeout(() => {
          setMessage(null);
          router.push("/");
        }, 3000);
      } catch (error) {
        setColour(
          "bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
        );
        setMessage("El email del cliente ya ha sido registrado anteriormente");
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    },
  });

  const showMessage = () => (
    <div className={colour}>
      <p>{message}</p>
    </div>
  );

  // Render loading message if the client check or cookie validation is not complete
  if (!isClient || !cookie) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Header />

      <h1 className="text-2xl text-gray-800 font-light text-center mt-10">
        Crear Nuevo Cliente
      </h1>

      {message && showMessage()}

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-lg">
          <form
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="name"
                type="text"
                placeholder="John"
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
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="surname"
              >
                Apellido
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="surname"
                type="text"
                placeholder="Doe"
                value={formik.values.surname}
                onChange={formik.handleChange}
              />
              {formik.touched.surname && formik.errors.surname && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.surname}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="email"
                type="email"
                placeholder="abc@mail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.email}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="company"
              >
                Empresa
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="company"
                type="text"
                placeholder="Company Name"
                value={formik.values.company}
                onChange={formik.handleChange}
              />
              {formik.touched.company && formik.errors.company && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.company}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Teléfono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
                id="phone"
                type="tel"
                placeholder="1234567890"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
                  <p>{formik.errors.phone}</p>
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

export default NewClient;
