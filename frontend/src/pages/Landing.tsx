// Local Imports
import ButtonSubmit from "../components/ButtonSubmit";
import Textbox from "../components/Textbox";
import { loginSchema } from "../utils/auth.schema";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { axiosNoAuth } from "../api/Axios";
import axios from "axios";

type LoginProps = z.infer<typeof loginSchema>;

axios.defaults.withCredentials = true;

export default function Landing() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }} = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (data: LoginProps) => {
    try {
      await axiosNoAuth.post("/auth/login",
        { email: data.email, password: data.password}
      );
      console.log(Cookies.get("token"))
      navigate("/dashboard");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="mx-auto self-center flex bg-white rounded-lg shadow-lg overflow-hidden sm:w-3/5 md:max-w-lg lg:max-w-4xl lg:max-h-3/5 lg:w-4/5">
        <div className="hidden lg:block lg:w-1/2 bg-cover bg-[url('/src/assets/random-image.webp')]"></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Skill Issue
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-8">
              <label className="block text-gray-700 text-sm mb-2">
                Email Address
              </label>
              <Textbox id="email" {...register("email")} name="email" type="email" autoComplete="email" />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            <div className="mt-8">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm mb-2">Password</label>
                <a href="#" className="text-xs font-normal text-indigo-600 hover:underline h-fit">
                  Forgot your password?
                </a>
              </div>
              <Textbox id="password" {...register("password")} name="password" type="password" autoComplete="password" />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>

            <div className="mt-8" title="Sign-In">
              {/* <ButtonPrimary text="Sign-In" url="/dashboard" /> */}
              <ButtonSubmit text="Sign-In" />
            </div>
          </form>
          
          <div className="mt-4 flex gap-1 items-center justify-center">
            <Link to="/register" className="text-xs text-indigo-600 hover:text-indigo-300 font-bold">
              Don't Have an Account? Register Here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
