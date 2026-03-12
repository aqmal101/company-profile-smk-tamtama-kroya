"use client";

import { useMemo, useState } from "react";
import { LuGripVertical, LuPlus, LuTrash2 } from "react-icons/lu";
import { TextButton } from "@/components/Buttons/TextButton";

interface SortableListInputProps {
  label: string;
  value: string[];
  onChange: (nextValue: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  disabled?: boolean;
  isMandatory?: boolean;
  error?: string;
  className?: string;
  maxItems?: number;
  emptyText?: string;
}

const normalizeValue = (value: string) => value.trim().replace(/\s+/g, " ");

const includesIgnoreCase = (items: string[], value: string) => {
  const normalized = normalizeValue(value).toLowerCase();
  return items.some((item) => item.toLowerCase() === normalized);
};

export default function SortableListInput({
  label,
  value,
  onChange,
  placeholder = "Ketik lalu tekan Enter",
  addButtonText = "Tambah",
  disabled = false,
  isMandatory = false,
  error,
  className = "",
  maxItems,
  emptyText = "Belum ada item.",
}: SortableListInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const normalizedValues = useMemo(
    () => value.map((item) => normalizeValue(item)).filter(Boolean),
    [value],
  );

  const canAddMore = !maxItems || normalizedValues.length < maxItems;
  const nextInputValue = normalizeValue(inputValue);
  const canAdd =
    !disabled &&
    Boolean(nextInputValue) &&
    canAddMore &&
    !includesIgnoreCase(normalizedValues, nextInputValue);

  const addItem = () => {
    const nextValue = normalizeValue(inputValue);

    if (!nextValue || disabled || !canAddMore) {
      return;
    }

    if (includesIgnoreCase(normalizedValues, nextValue)) {
      return;
    }

    onChange([...normalizedValues, nextValue]);
    setInputValue("");
  };

  const removeItem = (index: number) => {
    if (disabled) {
      return;
    }

    onChange(normalizedValues.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (disabled) {
      return;
    }

    setDraggingIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetIndex: number,
  ) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const sourceIndex = Number(
      event.dataTransfer.getData("text/plain") || draggingIndex,
    );

    setDraggingIndex(null);

    if (
      !Number.isFinite(sourceIndex) ||
      sourceIndex < 0 ||
      sourceIndex >= normalizedValues.length ||
      sourceIndex === targetIndex
    ) {
      return;
    }

    const reorderedItems = [...normalizedValues];
    const [movedItem] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(targetIndex, 0, movedItem);

    onChange(reorderedItems);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm max-sm:text-xs font-semibold text-gray-700">
        {label} {isMandatory && <span className="text-red-500">*</span>}
      </label>

      <div className="flex flex-col gap-2">
        {normalizedValues.length > 0 ? (
          normalizedValues.map((item, index) => (
            <div
              key={`${item}-${index}`}
              draggable={!disabled}
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 border border-gray-300 rounded-sm px-2 py-2 ${
                disabled ? "" : "cursor-move"
              } ${draggingIndex === index ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-1 text-gray-500">
                <LuGripVertical className="text-sm" />
              </div>
              <span className="text-sm text-gray-700 flex-1">{item}</span>
              <TextButton
                variant="outline-danger"
                icon={<LuTrash2 className="text-md" />}
                className="p-1! text-md"
                disabled={disabled}
                onClick={() => removeItem(index)}
              />
            </div>
          ))
        ) : (
          <div className="border border-dashed border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-400">
            {emptyText}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
          disabled={disabled || !canAddMore}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
        />
        <TextButton
          variant="outline"
          icon={<LuPlus className="text-sm" />}
          text={addButtonText}
          className="py-1.5! whitespace-nowrap"
          disabled={!canAdd}
          onClick={addItem}
        />
      </div>

      {maxItems && (
        <p className="text-xs text-gray-500">
          {normalizedValues.length}/{maxItems} item
        </p>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
