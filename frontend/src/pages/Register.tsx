// Local Imports
import Textbox from "../components/Textbox";
import ButtonSubmit from "../components/ButtonSubmit";
import { registerSchema } from "../utils/auth.schema";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../api/Axios";
import Cookies from "js-cookie";
import { JwtUser } from "../utils/interfaces";
import { BASE_URL } from "../utils/constants";

type RegisterProps = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      zId: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "student",
    },
  });

  const onSubmit = async (data: RegisterProps) => {
    try {
      setLoading(true);
      await axios.post(BASE_URL + "/auth/register", {
        email: data.email,
        password: data.password,
        fullname: data.name,
        zid: data.zId,
        userType: data.userType,
      });
      const decoded: JwtUser = jwtDecode(getToken());
      Cookies.set('userType', decoded.userType);
      navigate("/upload");
    } catch (error: any) {
      console.log(error)
      if (error.response.status === 409) {
        setError(error.response.data)
        setShowError(true);
      } else {
        setError("An error occurred");
        setShowError(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-5">
      <div className="flex max-h-screen min-h-screen flex-1 flex-col justify-center px-6 py-9 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-4xl text-center font-extralight tracking-wide">
            Skill Issue
          </h1>
          <h2 className="mt-2 text-xl text-center tracking-wide font-semibold leading-9 text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Name
              </label>
              <div className="mt-3">
                <Textbox
                  id="name"
                  {...register("name")}
                  type="text"
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="zId"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                zID
              </label>
              <div className="mt-3">
                <Textbox
                  id="zId"
                  {...register("zId")}
                  type="text"
                  autoComplete="zId"
                />
                {errors.zId && (
                  <p className="text-red-600 text-sm">{errors.zId.message}</p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label
                htmlFor="userType"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User Type
              </label>
              <div className="mt-3">
                <input
                  id="student"
                  type="radio"
                  value="student"
                  {...register("userType")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="student" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Student</label>
              </div>
              <div className="mt-3">
                <input
                  id="academic"
                  type="radio"
                  value="academic"
                  {...register("userType")}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                <label htmlFor="academic" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Academic</label>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Address
              </label>
              <div className="mt-3">
                <Textbox
                  id="email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-3">
                <Textbox
                  id="password"
                  {...register("password")}
                  type="password"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-3">
                <Textbox
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type="password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              {loading ? (
                <ButtonLoading />
              ) : (
                <ButtonSubmit text="Register Now!" />
              )}
              {showError && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Got an account?{" "}
            <Link
              to="/"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-300"
            >
              Sign-In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
