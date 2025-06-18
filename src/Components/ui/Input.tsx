import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, required, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-gray-700 mb-1">
      {label}{required && <span className="text-red-500"> *</span>}
    </label>
    <input
      {...props}
      className={`w-full border px-2 py-2 rounded focus:outline-none focus:ring-2 ${
        error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
      }`}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);
