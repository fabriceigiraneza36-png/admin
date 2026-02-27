import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="search-bar">
      <HiOutlineSearch className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}