"use client";

import { LuTrash2, LuGripVertical } from "react-icons/lu";
import { useState, useEffect } from "react";
// import { InputText } from "@/components/InputForm/TextInput";
import Toggle from "@/components/ui/toggle";

interface RequirementCardProps {
  id: string;
  label: string;
  isActive: boolean;
  isRequired: boolean;
  isLoading?: boolean;
  onToggle?: (id: string, isActive: boolean) => void;
  onRequiredChange?: (id: string, isRequired: boolean) => void;
  onLabelChange?: (id: string, label: string) => void;
  onDelete?: (id: string) => void;
  isEditable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  index?: number;
}

export const RequirementCard = ({
  id,
  label,
  isActive,
  isRequired,
  onToggle,
  onRequiredChange,
  onLabelChange,
  onDelete,
  isLoading,
  isEditable = false,
  onDragStart,
  onDragOver,
  onDrop,
  index = 0,
}: RequirementCardProps) => {
  const [localLabel, setLocalLabel] = useState(label);

  // Update localLabel when label prop changes
  useEffect(() => {
    setLocalLabel(label);
  }, [label]);

  const handleLabelBlur = () => {
    if (localLabel !== label) {
      onLabelChange?.(id, localLabel);
    }
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLabelBlur();
    }
  };

  const canEdit = !isActive;

  return (
    <div
      draggable={!isActive}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={(e) => onDrop?.(e, index)}
      className={`flex items-center gap-3 py-2 px-2 rounded-md transition-all ${
        isActive
          ? "cursor-not-allowed bg-gray-100"
          : "cursor-move hover:bg-gray-50"
      }`}
    >
      {/* Drag Handle */}
      {!isActive && (
        <LuGripVertical size={18} className="text-gray-400 cursor-move" />
      )}

      {/* Checkbox Required */}
      <input
        type="checkbox"
        checked={isRequired}
        onChange={(e) => onRequiredChange?.(id, e.target.checked)}
        disabled={!canEdit}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:cursor-not-allowed"
      />

      {/* Toggle Active */}
      <Toggle
        enabled={isActive}
        onChange={(enabled) => onToggle?.(id, enabled)}
      />

      {/* Label Input */}
      <div className="w-full">
        <input
          placeholder="Masukkan syarat pendaftaran"
          className={`w-full h-10 px-3 py-2 border border-gray-300 rounded ${
            isEditable && canEdit ? "cursor-pointer hover:border-primary" : ""
          } ${!isActive ? "text-gray-700" : "text-gray-400 bg-gray-50"} ${
            !canEdit ? "cursor-not-allowed opacity-60" : ""
          }`}
          value={localLabel}
          onChange={(e) => setLocalLabel(e.target.value)}
          onBlur={handleLabelBlur}
          onKeyDown={handleLabelKeyDown}
          disabled={isLoading || !canEdit}
        />
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete?.(id)}
        disabled={!canEdit}
        className={`p-2 rounded transition-all ${
          canEdit
            ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
            : "text-gray-300 cursor-not-allowed"
        }`}
        aria-label="Delete requirement"
      >
        <LuTrash2 size={18} />
      </button>
    </div>
  );
};
