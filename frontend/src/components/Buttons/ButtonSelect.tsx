export default function ButtonSelect({ text, onClick, classname, disabled }: { text: string, onClick?: () => void, classname?: string, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`transition duration-150 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap disabled:cursor-default disabled:bg-indigo-300 ${classname}`}
    >
      {text}
    </button >
  )
} 