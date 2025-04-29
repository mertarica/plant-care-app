import React from "react";

type InputProps = {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  variant?: "default" | "success" | "error";
  min?: string;
  max?: string;
};

export default function Input({
  id,
  name,
  label,
  placeholder,
  value,
  type = "text",
  onChange,
  onBlur,
  error,
  min,
  max,
  disabled = false,
  required = false,
  className = "",
  variant = "default",
}: InputProps) {
  const baseClasses =
    "w-full px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2";

  const variants = {
    default:
      "border border-gray-300 focus:border-plant-green-500 focus:ring-plant-green-200",
    success:
      "border border-green-500 focus:border-green-600 focus:ring-green-200",
    error: "border border-red-500 focus:border-red-600 focus:ring-red-200",
  };

  const inputId = id || name;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        min={min} 
        max={max}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`${baseClasses} ${variants[error ? "error" : variant]} ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
