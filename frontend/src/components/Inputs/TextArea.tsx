const TextArea = ({ id, name, autoComplete, placeholder}: { id: string, name: string, autoComplete: string, placeholder: string}) => {
  return (
      <textarea 
        id={id}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
      />
  );
};

export default TextArea

