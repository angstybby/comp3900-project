// Local Imports
import Textbox from "../components/Textbox";
import ButtonSubmit from "../components/ButtonSubmit";
import { registerSchema } from "../utils/auth.schema";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosNoAuth } from "../api/Axios";

type RegisterProps = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterProps>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      zId: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: RegisterProps) => {
    try {
      await axiosNoAuth.post("/auth/register",
        { email: data.email, password: data.password, fullname: data.name, zid: data.zId }
      );
      navigate("/upload");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="p-5">
      <div className="flex max-h-screen min-h-screen flex-1 flex-col justify-center px-6 py-9 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-4xl text-center font-extralight tracking-wide">Skill Issue</h1>
          <h2 className="mt-2 text-xl text-center tracking-wide font-semibold leading-9 text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-3">
                <Textbox id="name" {...register("name")} type="text" autoComplete="name" />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="zId" className="block text-sm font-medium leading-6 text-gray-900">
                zID
              </label>
              <div className="mt-3">
                <Textbox id="zId" {...register("zId")} type="text" autoComplete="zId" />
                {errors.zId && <p className="text-red-600 text-sm">{errors.zId.message}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-3">
                <Textbox id="email" {...register("email")} type="email" autoComplete="email" />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-3">
                <Textbox id="password" {...register("password")} type="password" autoComplete="new-password" />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
              </div>
              <div className="mt-3">
                <Textbox id="confirmPassword" {...register("confirmPassword")} type="password" autoComplete="new-password" />
                {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <ButtonSubmit text="Register Now!" />
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Got an account?{' '}
            <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-300">
              Sign-In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
