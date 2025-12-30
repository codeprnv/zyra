import React, { forwardRef } from 'react';

interface BaseProps {
  label?: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'textarea';
  className?: string;
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLAreaElement, Props>(
  ({ label, type = 'text', className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && (
          <label className='mb-1 block font-semibold text-gray-300'>
            {label}
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`w-full rounded-md border border-gray-700 bg-transparent p-2 text-white outline-none ${className}`}
            {...(props as TextareaProps)}
          />
        ) : (
          <input
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={`w-full rounded-md border border-gray-700 bg-transparent p-2 text-white outline-none ${className}`}
            {...(props as InputProps)}
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
