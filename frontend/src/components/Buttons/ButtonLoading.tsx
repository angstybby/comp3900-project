import LoadingCircle from "@/components/LoadingCircle";

export default function ButtonLoading() {
  return (
    <div className="flex w-full justify-center rounded-md bg-indigo-800 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900">
      <LoadingCircle />
    </div>
  );
}
