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
                    <input 
                      id='email'
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                    />
                </div>
                <div className="mt-8">
                    <div className="flex justify-between">
                        <label className="block text-gray-700 text-sm mb-2">Password</label>
                        <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-300 h-fit">
                          Forgot your password?
                        </a>
                    </div>
                    <input 
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                <div className="mt-8" title="Login Button">
                    <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Sign-In
                    </button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500 ">Don't Have an Account?</p>
                    <a href="#" className="text-xs text-indigo-600 hover:text-indigo-300 font-bold">Register Here!</a>
                </div>
            </div>
        </div>
    </div>
  )
}
