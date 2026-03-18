"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  allowCustomValues?: boolean; // Allow adding custom values
  customValuePrefix?: string; // Prefix for custom values (optional)
  onCreateCustomValue?: (value: string) => void; // Callback when custom value is created
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
  allowCustomValues = false,
  customValuePrefix = "",
  onCreateCustomValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected options with their labels
  const selectedOptions = useMemo(() => {
    const selected: SelectOption[] = [];

    selectedValues.forEach((value) => {
      // Check if value exists in options
      const existingOption = options.find((opt) => opt.value === value);
      if (existingOption) {
        selected.push(existingOption);
      } else if (allowCustomValues && typeof value === "string") {
        // For custom values (not in options), create a temporary option
        selected.push({
          value: value,
          label: value,
        });
      }
    });

    return selected;
  }, [options, selectedValues, allowCustomValues]);

  // Filter options based on search and selected values
  const filteredOptions = useMemo(
    () =>
      options.filter(
        (opt) =>
          !selectedValues.includes(opt.value) &&
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [options, selectedValues, searchTerm],
  );

  // Check if search term matches any existing option
  const isExactMatch = useMemo(() => {
    return options.some(
      (opt) => opt.label.toLowerCase() === searchTerm.trim().toLowerCase(),
    );
  }, [options, searchTerm]);

  // Check if search term is already selected
  const isAlreadySelected = useMemo(() => {
    return selectedValues.includes(searchTerm.trim());
  }, [selectedValues, searchTerm]);

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
    // Keep focus on input after selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Handle Enter key for custom value
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedSearch = searchTerm.trim();

      if (trimmedSearch === "") return;

      // Check if we can add more items
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }

      // If exact match exists in options, select that option
      const exactMatch = options.find(
        (opt) => opt.label.toLowerCase() === trimmedSearch.toLowerCase(),
      );

      if (exactMatch) {
        e.preventDefault();
        handleSelect(exactMatch.value);
        return;
      }

      // If custom values are allowed and no exact match, add as custom value
      if (allowCustomValues && !isAlreadySelected) {
        e.preventDefault();

        // Format custom value with prefix if provided
        const customValue = customValuePrefix
          ? `${customValuePrefix}${trimmedSearch}`
          : trimmedSearch;

        // Call callback if provided
        if (onCreateCustomValue) {
          onCreateCustomValue(customValue);
        }

        onSelectionChange([...selectedValues, customValue]);
        setSearchTerm("");
        setIsOpen(false);

        // Keep focus on input after adding
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleRemoveBadge = (value: number | string) => {
    onSelectionChange(selectedValues.filter((v) => v !== value));
  };

  const canAddMore = !maxSelections || selectedValues.length < maxSelections;

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

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
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  options.some((o) => o.value === opt.value)
                    ? "bg-blue-100 text-blue-800" // Existing option
                    : "bg-green-100 text-green-800" // Custom value
                } ${badgeClassName}`}
              >
                <span>{opt.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBadge(opt.value)}
                  className="hover:bg-opacity-20 hover:bg-black rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${opt.label}`}
                  disabled={disabled}
                >
                  <LuX size={16} className="text-current" />
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
              ref={inputRef}
              type="text"
              placeholder={
                selectedOptions.length === 0 ? placeholder : searchPlaceholder
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              disabled={disabled || isLoading}
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
              onKeyDown={handleInputKeyDown}
            />
            <LuChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown Options */}
          {isOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  Memuat...
                </div>
              ) : (
                <div>
                  {/* Existing Options */}
                  {filteredOptions.length > 0 && (
                    <>
                      {filteredOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelect(opt.value)}
                          disabled={opt.disabled || !canAddMore}
                          className={`w-full px-3 py-2 text-left text-sm transition-colors
                            ${opt.disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-blue-50"}
                          `}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Custom value option */}
                  {allowCustomValues &&
                    searchTerm.trim() !== "" &&
                    !isExactMatch &&
                    !isAlreadySelected &&
                    canAddMore && (
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100"
                        onClick={() => {
                          const customValue = customValuePrefix
                            ? `${customValuePrefix}${searchTerm.trim()}`
                            : searchTerm.trim();

                          if (onCreateCustomValue) {
                            onCreateCustomValue(customValue);
                          }

                          onSelectionChange([...selectedValues, customValue]);
                          setSearchTerm("");
                          setIsOpen(false);

                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 0);
                        }}
                      >
                        + Tambahkan "{searchTerm.trim()}" sebagai nilai baru
                      </button>
                    )}

                  {/* No results message */}
                  {filteredOptions.length === 0 &&
                    (!allowCustomValues ||
                      searchTerm.trim() === "" ||
                      isExactMatch ||
                      !canAddMore) && (
                      <div className="p-3 text-center text-gray-500 text-sm">
                        {!canAddMore
                          ? `Maksimal ${maxSelections} item dipilih`
                          : searchTerm.trim() === ""
                            ? "Ketik untuk mencari"
                            : "Tidak ada hasil"}
                      </div>
                    )}
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
            {allowCustomValues && " (bisa menambahkan nilai baru)"}
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
