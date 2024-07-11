import { useEffect, useRef } from "react";

interface TextAreaProps {
  id: string;
  name: string;
  autoComplete: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}

const TextArea = ({ id, name, autoComplete, placeholder, value, disabled}: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      value={value}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
      style={{ resize: 'none' }}
      onChange={() => {
        autoResize();
      }}
      disabled={disabled}
    />
  );
};

export default TextArea

