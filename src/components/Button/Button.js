import React from "react";

function Button({ onClick, className = "", children }) {
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
}

export default Button;

