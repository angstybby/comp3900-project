import ButtonPrimary from "../components/ButtonPrimary";
import Textbox from "../components/Textbox";

export const Landing = () => {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="mx-auto self-center flex bg-white rounded-lg shadow-lg overflow-hidden sm:w-3/5 md:max-w-lg lg:max-w-4xl lg:max-h-3/5 lg:w-4/5">
        <div className="hidden lg:block lg:w-1/2 bg-cover bg-[url('/src/assets/random-image.webp')]"></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Skill Issue
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-8">
            <label className="block text-gray-700 text-sm mb-2">
              Email Address
            </label>
            <Textbox id="email" name="email" type="email" autoComplete="email" />
          </div>
          <div className="mt-8">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <a href="#" className="text-xs font-normal text-indigo-600 hover:underline h-fit">
                Forgot your password?
              </a>
            </div>
            <Textbox id="password" name="password" type="password" autoComplete="password" />
          </div>
          <div className="mt-8" title="Login Button">
            <ButtonPrimary text="Sign-In" url="/dashboard" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500 ">Don't Have an Account?</p>
            <a href="/register" className="text-xs text-indigo-600 hover:text-indigo-300 font-bold">Register Here!</a>
          </div>
        </div>
      </div>
    </div>
  )
}
