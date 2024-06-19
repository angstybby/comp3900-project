import { useNavigate } from "react-router-dom"

export default function ButtonPrimary({ text, url }: { text: string, url: string }) {
	const navigate = useNavigate();
	return (
	  <button
	    type="submit"
	    onClick={() => navigate(url)}
	    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
	  >
	    {text}
	  </button>
	)
}