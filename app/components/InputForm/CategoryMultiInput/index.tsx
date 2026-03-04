"use client";

import { useMemo, useState } from "react";
import { LuPlus, LuX } from "react-icons/lu";

interface CategoryMultiInputProps {
  label?: string;
  value: string[];
  onChange: (nextValue: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  isMandatory?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxItems?: number;
}

const normalizeValue = (value: string) => value.trim().replace(/\s+/g, " ");

const includesIgnoreCase = (items: string[], value: string) => {
  const normalized = normalizeValue(value).toLowerCase();
  return items.some((item) => item.toLowerCase() === normalized);
};

export default function CategoryMultiInput({
  label = "Kategori",
  value,
  onChange,
  suggestions = [],
  placeholder = "Ketik kategori lalu tekan Enter",
  isMandatory = false,
  disabled = false,
  error,
  className = "",
  maxItems,
}: CategoryMultiInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const canAddMore = !maxItems || value.length < maxItems;

  const normalizedSuggestions = useMemo(
    () =>
      Array.from(
        new Set(
          suggestions
            .map((item) => normalizeValue(item))
            .filter(Boolean)
            .filter((item) => !includesIgnoreCase(value, item)),
        ),
      ),
    [suggestions, value],
  );

  const filteredSuggestions = useMemo(() => {
    const keyword = normalizeValue(inputValue).toLowerCase();

    if (!keyword) {
      return normalizedSuggestions;
    }

    return normalizedSuggestions.filter((item) =>
      item.toLowerCase().includes(keyword),
    );
  }, [inputValue, normalizedSuggestions]);

  const addCategory = (rawValue: string) => {
    if (disabled || !canAddMore) {
      return;
    }

    const normalized = normalizeValue(rawValue);

    if (!normalized || includesIgnoreCase(value, normalized)) {
      setInputValue("");
      return;
    }

    onChange([...value, normalized]);
    setInputValue("");
    setIsOpen(false);
  };

  const removeCategory = (itemValue: string) => {
    if (disabled) {
      return;
    }

    onChange(
      value.filter((item) => item.toLowerCase() !== itemValue.toLowerCase()),
    );
  };

  return (
    <div className={`mb-2 ${className}`}>
      <label className="block text-sm max-sm:text-xs font-semibold text-gray-700 mb-2">
        {label} {isMandatory && <span className="text-red-500">*</span>}
      </label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item) => (
            <div
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeCategory(item)}
                disabled={disabled}
                className="rounded-full p-0.5 hover:bg-primary/20 disabled:cursor-not-allowed"
                aria-label={`Hapus kategori ${item}`}
              >
                <LuX className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div
          className={`flex items-center gap-2 border rounded-sm px-3 py-2 bg-white ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsOpen(false);
              }, 120);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addCategory(inputValue);
              }
            }}
            disabled={disabled || !canAddMore}
            placeholder={
              canAddMore
                ? placeholder
                : `Maksimal ${maxItems} kategori tercapai`
            }
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => addCategory(inputValue)}
            disabled={disabled || !canAddMore || !normalizeValue(inputValue)}
            className="inline-flex items-center justify-center rounded-sm border border-gray-300 p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Tambah kategori"
          >
            <LuPlus className="text-base" />
          </button>
        </div>

        {isOpen && filteredSuggestions.length > 0 && canAddMore && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-48 overflow-y-auto rounded-sm border border-gray-200 bg-white shadow-lg">
            {filteredSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => addCategory(item)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
