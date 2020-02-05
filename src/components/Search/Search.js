import React, { useRef, useEffect } from "react";

function Search({ value, onChange, onSubmit, children }) {
  const mainRef = useRef(null);
  useEffect(() => {
    mainRef.current.focus();
  });
  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="search">
        <input
          id="search"
          type="text"
          value={value}
          onChange={onChange}
          ref={mainRef}
        />
        <button type="submit">{children}</button>
      </label>
    </form>
  );
}

export default Search;
