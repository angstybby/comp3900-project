import ButtonPrimary from "../components/ButtonPrimary";
import Textbox from "../components/Textbox";

export default function Example() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-5xl text-center font-extralight tracking-wide">Skill <br /> Issue</h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Sign-up
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-4" action="#" method="POST">
            <div>
              <label htmlFor="name" className="block text-lg font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <Textbox id="name" name="name" type="text" autoComplete="name" />
              </div>
            </div>
            <div>
              <label htmlFor="zId" className="block text-lg font-medium leading-6 text-gray-900">
                zID
              </label>
              <div className="mt-2">
                <Textbox id="zId" name="zId" type="text" autoComplete="zId" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <Textbox id="email" name="email" type="email" autoComplete="email" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <Textbox id="password" name="password" type="password" autoComplete="new-password" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <Textbox id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" />
              </div>
            </div>

            <div>
              <ButtonPrimary text="Sign-up" />
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Got an account?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-300">
              Sign-in
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
