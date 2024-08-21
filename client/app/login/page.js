"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

// Importación de los íconos
import openEyeIcon from '/public/icons/open_eye.png';
import closedEyeIcon from '/public/icons/closed_eye.png';

const USER_AUTH = gql`
  mutation AuthUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

function Login() {
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [colour, setColour] = useState(
    "bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto"
  );

  const router = useRouter();
  const [AuthUser] = useMutation(USER_AUTH);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Email should not be empty"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;

      try {
        const { data } = await AuthUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });

        const { token } = data.authUser;
        const expires = new Date();
        expires.setHours(expires.getHours() + 3);

        setCookie("session-token", token, { expires, hhtpOnly: true });
        router.push("/");
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

  const showMessage = () => {
    return (
      <div className={colour}>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      {message && showMessage()}
      <div className="w-full max-w-sm px-4 sm:px-0 mx-auto">
        <h1 className="text-center mb-4">Login</h1>
        <form
          className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          onSubmit={formik.handleSubmit}
        >
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
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>

          {formik.touched.email && formik.errors.email ? (
            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
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
              onChange={formik.handleChange}
              value={formik.values.password}
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
            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-2">
              <p>{formik.errors.password}</p>
            </div>
          ) : null}

          <input
            type="submit"
            className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
            value="Enter"
          />
        </form>
        <div className="text-center mt-4">
          <p>
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-blue-700">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
