import * as React from 'react';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Textbox = React.forwardRef<HTMLInputElement, {
    id: string,
    name: string,
    type: string,
    autoComplete: string,
    [key: string]: any
}>(({ id, name, type, autoComplete, ...rest }, ref) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            autoComplete={autoComplete}
            ref={ref}
            required
            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6"
            {...rest}
        />
    );
});

export default Textbox;

