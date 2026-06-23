import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, error, helper, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-black text-black dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all duration-200`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helper}</p>}
    </div>
  );
};

export default Input;