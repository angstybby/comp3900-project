import ButtonPrimary from "@/components/Buttons/ButtonPrimary";

export default function CourseReco() {
  return (
    <>
      <div className="flex min-h-screen justify-center py-10">
        <div className="w-full max-w-xl">
          <h1 className="text-5xl text-center font-extralight tracking-wide">Skill <br /> Issue</h1>
          <h2 className="mt-10 text-2xl text-center tracking-wide font-normal leading-9 text-gray-900">
            Here are some recommendations or you can create your own group
          </h2>

          <div className="mt-8">
            <form className="max-w-l mx-auto space-y-4" action="#" method="POST">
              <div>
                <label htmlFor="coursesDone" className="block text-lg font-medium leading-6 text-gray-900">
                  stub: Group recommendations here
                </label>
              </div>
              <div>
                <label htmlFor="OrLabel" className="block text-lg text-center font-medium leading-6 text-gray-900">
                  <b>OR</b>
                </label>
              </div>
              <div className="mt-4">
                <ButtonPrimary text="Create Group" url="/Dashboard" />
              </div>
            </form>
          </div>
          <div className="mt-20 flex justify-end">
            <div className="w-1/6">
              <ButtonPrimary text="Next" url="/Dashboard" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}