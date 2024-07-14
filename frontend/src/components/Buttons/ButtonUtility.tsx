export default function ButtonUtility({ text, onClick, classname }: { text: string, onClick: () => void, classname?: string }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap ${classname}`}
    >
      {text}
    </button >
  )
} ``