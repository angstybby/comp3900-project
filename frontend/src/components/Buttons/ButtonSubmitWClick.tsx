// ButtonSubmitWithClick.tsx
import React from 'react';

interface ButtonSubmitWithClickProps {
  text: string;
  onClick: () => void;
}

const ButtonSubmitWithClick: React.FC<ButtonSubmitWithClickProps> = ({ text, onClick }) => {
  return (
    <button 
      type="button" 
      className="btn btn-primary flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ButtonSubmitWithClick;
