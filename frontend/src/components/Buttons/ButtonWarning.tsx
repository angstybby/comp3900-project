export default function ButtonWarning({ text, onClick }: { text: string, onClick?: () => void }) {
    return (
        <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onClick}
        >
            {text}
        </button>
    )
}