"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

import openEyeIcon from "/public/icons/open_eye.png";
import closedEyeIcon from "/public/icons/closed_eye.png";

// GraphQL mutation to create a new user account
const NEW_ACCOUNT = gql`
  mutation newUser($input: UserInput) {
    newUser(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

// GraphQL mutation to authenticate the user
const USER_AUTH = gql`
  mutation AuthUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

function SignIn() {
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [colour, setColour] = useState(
    "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
  );

  const [newUser] = useMutation(NEW_ACCOUNT); // Mutation hook for creating a new user
  const [AuthUser] = useMutation(USER_AUTH); // Mutation hook for authenticating the user

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es obligatorio"),
      surname: Yup.string().required("El apellido es obligatorio"),
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("El password no puede estar vacío")
        .min(6, "El password debe ser de al menos 6 caracteres"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Debe confirmar su contraseña"),
    }),
    onSubmit: async (values) => {
      const { name, surname, email, password } = values;

      try {
        const { data } = await newUser({
          variables: {
            input: {
              nombre: name,
              apellido: surname,
              email,
              password,
            },
          },
        });

        setColour(
          "bg-green-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
        );
        setMessage(`User ${data.newUser.nombre} created successfully`);
        const response = await AuthUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });

        const { token } = response.data.authUser;
        const expires = new Date();
        expires.setHours(expires.getHours() + 3);

        setCookie("session-token", token, { expires, hhtpOnly: true });
        setTimeout(() => {
          setMessage(null);
          router.push("/");
        }, 3000);
      } catch (error) {
        setColour(
          "bg-red-300 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
        );
        setMessage(error.message.replace("ApolloError: ", ""));
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const showMessage = () => {
    return (
      <div className={colour}>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-sm px-4 sm:px-0 mx-auto">
        <h1 className="text-center mb-4">Sign Up</h1>
        {message && showMessage()}

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
          </div>

          {formik.touched.name && formik.errors.name ? (
            <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
              <p>{formik.errors.name}</p>
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
              id="surname"
              type="text"
              placeholder="Doe"
              value={formik.values.surname}
              onChange={formik.handleChange}
            />
          </div>

          {formik.touched.surname && formik.errors.surname ? (
            <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
              <p>{formik.errors.surname}</p>
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
              id="email"
              type="email"
              placeholder="abc@mail.com"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>

          {formik.touched.email && formik.errors.email ? (
            <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
              <p>{formik.errors.email}</p>
            </div>
          ) : null}

          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="1234abcde"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 text-gray-600"
              onClick={toggleShowPassword}
            >
              <img
                src={showPassword ? openEyeIcon.src : closedEyeIcon.src}
                alt={showPassword ? "Hide Password" : "Show Password"}
                className="mt-7 h-5 w-5"
              />
            </button>
          </div>

          {formik.touched.password && formik.errors.password ? (
            <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
              <p>{formik.errors.password}</p>
            </div>
          ) : null}

          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2"
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 text-gray-600"
              onClick={toggleShowConfirmPassword}
            >
              <img
                src={showConfirmPassword ? openEyeIcon.src : closedEyeIcon.src}
                alt={showConfirmPassword ? "Hide Password" : "Show Password"}
                className="mt-7 h-5 w-5"
              />
            </button>
          </div>

          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="my-2 bg-red-100 border-l-4 border-red-500 test-red-700 p-2">
              <p>{formik.errors.confirmPassword}</p>
            </div>
          ) : null}

          <input
            type="submit"
            className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
            value="Register"
          />
        </form>
      </div>
    </section>
  );
}

export default SignIn;
