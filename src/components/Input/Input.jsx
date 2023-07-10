import { useState } from "react";

function Input({
  textLabel,
  type,
  className,
  id,
  placeholder,
  value,
  onChange,
}) {
  return (
    <>
      <label>
        <p className='p-login'>{textLabel}</p>
        <input
          type={type}
          className={className}
          id={id}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
        />
      </label>
    </>
  );
}

export default Input;
