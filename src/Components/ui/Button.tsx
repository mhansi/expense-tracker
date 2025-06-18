import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", children, ...props }) => {
  const baseClasses = "px-4 py-2 rounded transition w-full sm:w-auto";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-800 hover:bg-gray-400";

  return (
    <button {...props} className={`${baseClasses} ${variantClasses} ${props.className || ""}`}>
      {children}
    </button>
  );
};
