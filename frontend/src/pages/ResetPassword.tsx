import ButtonSubmit from "../components/ButtonSubmit";
import Textbox from "../components/Textbox";
import { forgetPasswordSchema, resetPasswordSchema } from "../utils/auth.schema";

import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosNoAuth } from "../api/Axios";
import axios from "axios";
import { useState } from "react";
import ButtonLoading from "../components/ButtonLoading";


type ForgetPasswordProps = z.infer<typeof forgetPasswordSchema>;
type ResetPasswordProps = z.infer<typeof resetPasswordSchema>;

axios.defaults.withCredentials = true;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [loading, setloading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const form = useForm<ForgetPasswordProps>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  const formVerification = useForm<ResetPasswordProps>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      verificationCode: "",
      password: "",
      confirmPassword: "",
    }
  });



  const onSubmit = async (data: { email: string }) => {
    try {
      // Send verification email logic goes here
      setloading(true);
      await axiosNoAuth.post("/auth/reset-password", { email: data.email });
      setShowEmailForm(false);
      setloading(false);
      setShowVerificationForm(true);
    } catch (error) {
      setloading(false);
      console.error(error);
    }
  };

  const onSubmitVerification = async (data: { verificationCode: string, password: string }) => {
    try {
      setloading(true);
      await axiosNoAuth.post("/auth/change-password", { resetToken: data.verificationCode, password: data.password });
      setloading(false);
      // delay for 2 seconds
      setPasswordSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPasswordSuccess(false);
      navigate("/"); // Redirect to reset password page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="mx-auto self-center flex bg-white rounded-lg shadow-xl overflow-hidden sm:w-3/5 md:max-w-lg lg:max-w-4xl lg:max-h-3/5 lg:w-[600px]">
        <div className="w-full p-8">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Skill Issue
          </h2>
          <p className="text-xl text-gray-600 text-center">Forgot your password?</p>

          {showEmailForm && (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mt-8">
                <label className="block text-gray-700 text-sm mb-2">
                  Email Address
                </label>
                <Textbox id="email" type="email" autoComplete="email" {...form.register('email', { required: true })} />
                {form.formState.errors.email && <p className="text-red-600 text-sm">Please enter a valid email address.</p>}
              </div>

              <div className="mt-8">
                {loading ? <ButtonLoading /> : <ButtonSubmit text="Send Verification Email" />}
              </div>
            </form>
          )}

          {showVerificationForm && (
            <form onSubmit={formVerification.handleSubmit(onSubmitVerification)}>
              <div className="mt-8">
                <label className="block text-gray-700 text-sm mb-2">
                  Verification Code
                </label>
                <Textbox id="verificationCode" type="text" autoComplete="off" {...formVerification.register('verificationCode', { required: true })} />
                {formVerification.formState.errors.verificationCode && <p className="text-red-600 text-sm">Please enter the verification code.</p>}
                <label className="block text-gray-700 text-sm mt-4 mb-2">
                  New Password
                </label>
                <Textbox id="password" type="password" autoComplete="off" {...formVerification.register('password', { required: true })} />
                {formVerification.formState.errors.password && <p className="text-red-600 text-sm">Please enter a new password.</p>}
                <label className="block text-gray-700 text-sm mt-4 mb-2">
                  New Password
                </label>
                <Textbox id="password" type="password" autoComplete="off" {...formVerification.register('confirmPassword', { required: true })} />
                {formVerification.formState.errors.password && <p className="text-red-600 text-sm">Please enter a new password.</p>}

              </div>

              <div className="mt-8 text-center">
                {loading ? <ButtonLoading /> : <ButtonSubmit text="Set New Password" />}
                {passwordSuccess && <p className="text-green-600 text-sm mt-4">Password has been successfully changed.</p>}
              </div>
            </form>
          )}

          <div className="mt-4 flex gap-1 items-center justify-center">
            <Link to="/" className="text-xs text-indigo-600 hover:text-indigo-300 font-bold">
              Remembered your password? Sign-In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
