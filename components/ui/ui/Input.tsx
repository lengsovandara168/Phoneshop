"use client";

import React from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { value, onChange, className, ...rest },
  ref
) {
  return (
    <input
      {...rest}
      ref={ref}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-300 px-3 py-2 ${
        className ?? ""
      }`}
    />
  );
});
Input.displayName = "Input";

export default Input;
