import { useNavigate } from "react-router-dom"

export default function ButtonPrimary({ text, url, classname }: { text: string, url: string, classname?: string }) {
	const navigate = useNavigate();

	return (
		<button
			type="submit"
			onClick={() => navigate(url)}
			className={`transition duration-100 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap ${classname}`}
		>
			{text}
		</button>
	)
}