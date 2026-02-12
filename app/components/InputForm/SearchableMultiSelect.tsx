"use client";

import React, { useState, useMemo } from "react";
import { LuX, LuChevronDown } from "react-icons/lu";

export interface SelectOption {
  value: number | string;
  label: string;
  disabled?: boolean;
}

export interface SearchableMultiSelectProps {
  options: SelectOption[];
  selectedValues: (number | string)[];
  onSelectionChange: (values: (number | string)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  isMandatory?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  badgeClassName?: string;
  maxSelections?: number;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Pilih items...",
  searchPlaceholder = "Cari...",
  label,
  isMandatory = false,
  isLoading = false,
  disabled = false,
  error,
  className = "",
  badgeClassName = "",
  maxSelections,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedValues.includes(opt.value)),
    [options, selectedValues],
  );

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (opt) =>
          !selectedValues.includes(opt.value) &&
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [options, selectedValues, searchTerm],
  );

  const handleSelect = (value: number | string) => {
    const isSelected = selectedValues.includes(value);

    if (isSelected) {
      // Remove
      onSelectionChange(selectedValues.filter((v) => v !== value));
    } else {
      // Add
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      onSelectionChange([...selectedValues, value]);
    }

    setSearchTerm("");
  };

  const handleRemoveBadge = (value: number | string) => {
    onSelectionChange(selectedValues.filter((v) => v !== value));
  };

  const canAddMore = !maxSelections || selectedValues.length < maxSelections;

  return (
    <div className={`form-item ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {isMandatory && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {/* Selected Badges */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedOptions.map((opt) => (
              <div
                key={opt.value}
                className={`inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium ${badgeClassName}`}
              >
                <span>{opt.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBadge(opt.value)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${opt.label}`}
                  disabled={disabled}
                >
                  <LuX size={16} className="text-danger" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search Input and Dropdown */}
        <div className="relative">
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`flex items-center justify-between w-full px-3 py-2.5 border rounded-sm transition-all cursor-pointer
              ${disabled ? "bg-gray-100 cursor-not-allowed border-gray-300" : "bg-white border-gray-300"}
              ${error ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"}
              ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
            `}
          >
            <input
              type="text"
              placeholder={
                selectedOptions.length === 0 ? placeholder : searchPlaceholder
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              disabled={disabled || isLoading}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
            />
            <LuChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  Memuat...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  {selectedOptions.length === 0 && options.length === 0
                    ? "Tidak ada pilihan"
                    : "Tidak ada hasil"}
                </div>
              ) : (
                <div>
                  {filteredOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      disabled={
                        opt.disabled || (disabled && !canAddMore && !isOpen)
                      }
                      className={`w-full px-3 py-2 text-left text-sm transition-colors
                        ${opt.disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-blue-50"}
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Validation Message */}
        {selectedOptions.length === 0 && isMandatory && (
          <p className="text-red-500 text-sm">Pilih minimal satu item</p>
        )}

        {/* Helper Text */}
        {maxSelections && (
          <p className="text-xs text-gray-500 mt-1">
            {selectedValues.length}/{maxSelections} item dipilih
          </p>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default SearchableMultiSelect;
