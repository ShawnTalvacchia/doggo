"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Reusable search input with glassmorphism style.
 * Matches the inbox search pattern: pill-shaped, surface-inset bg,
 * leading magnifying glass, trailing clear button.
 */
export function SearchInput({ value, onChange, placeholder = "Search...", autoFocus }: SearchInputProps) {
  return (
    <div className="search-input">
      <MagnifyingGlass size={16} weight="light" className="search-input-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input-field"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="search-input-clear"
          aria-label="Clear search"
        >
          <X size={10} weight="bold" />
        </button>
      )}
    </div>
  );
}
