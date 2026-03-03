"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LuChevronDown, LuChevronLeft, LuX } from "react-icons/lu";

interface YearRange {
  id: string;
  startYear: number;
  endYear: number;
  label: string;
  years: number[];
}

interface GenerationYearDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
}

const RANGE_SIZE = 11;

const buildYearRanges = (maxYear: number, minYear: number): YearRange[] => {
  const ranges: YearRange[] = [];
  let cursor = maxYear;

  while (cursor >= minYear) {
    const endYear = Math.max(minYear, cursor - (RANGE_SIZE - 1));
    const years: number[] = [];

    for (let year = cursor; year >= endYear; year -= 1) {
      years.push(year);
    }

    ranges.push({
      id: `${endYear}-${cursor}`,
      startYear: cursor,
      endYear,
      label: `${endYear}-${cursor}`,
      years,
    });

    cursor = endYear - 1;
  }

  return ranges;
};

export default function GenerationYearDropdown({
  value,
  onChange,
  className = "",
  placeholder = "Semua Angkatan",
  minYear = 1977,
  maxYear = new Date().getFullYear() - 1,
  disabled = false,
}: GenerationYearDropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeRangeId, setActiveRangeId] = useState<string | null>(null);

  const ranges = useMemo(
    () => buildYearRanges(maxYear, minYear),
    [maxYear, minYear],
  );

  const activeRange = useMemo(
    () => ranges.find((range) => range.id === activeRangeId) || null,
    [ranges, activeRangeId],
  );

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveRangeId(null);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setActiveRangeId(null);
      }
      return next;
    });
  };

  const handleSelectYear = (year: number) => {
    onChange(String(year));
    setIsOpen(false);
    setActiveRangeId(null);
  };

  const triggerLabel = value ? `Angkatan ${value}` : placeholder;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
          }
        }}
        className={`flex h-fit items-center justify-between rounded-sm border py-2 border-gray-300 bg-white px-3 text-sm transition-all ${
          value ? "text-gray-900" : "text-gray-400"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <span className="truncate">{triggerLabel}</span>
        <LuChevronDown
          className={`ml-2 shrink-0 text-gray-600 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-full rounded-md border border-gray-200 bg-white p-2 shadow-lg">
          {activeRange ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRangeId(null)}
                  className="flex items-center gap-1 rounded px-1 py-1 text-xs text-gray-600 hover:bg-gray-100"
                >
                  <LuChevronLeft className="text-lg" />
                </button>
                <span className="text-xs font-medium text-gray-600">
                  {activeRange.label}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveRangeId(null)}
                  className="flex items-center gap-1 rounded px-1 py-1 text-xs text-white"
                >
                  <LuX className="text-lg" />
                </button>
              </div>
              <div className="grid min-h-0 grid-cols-3 gap-2 overflow-y-auto pr-1">
                {activeRange.years.map((year) => {
                  const yearString = String(year);
                  const isSelected = value === yearString;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectYear(year)}
                      className={`rounded border px-2 py-1 text-sm transition-colors ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`mb-2 w-full rounded border px-3 py-1.5 text-left text-sm transition-colors ${
                  value === ""
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Semua Angkatan
              </button>
              <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                {ranges.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => setActiveRangeId(range.id)}
                    className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span>{range.label}</span>
                    <span className="text-xs text-gray-400">
                      {range.years.length}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
