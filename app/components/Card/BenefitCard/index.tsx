"use client";

import React, { useState } from "react";

export interface BenefitItem {
  id: string;
  title: string;
  benefit: string;
  order: number;
  isActive: boolean;
}

interface BenefitCardProps {
  item: BenefitItem;
  isEditable?: boolean;
  onChange?: (id: string, updated: Partial<BenefitItem>) => void;
  onDelete?: (id: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  index?: number;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  item,
  // isEditable = true,
  onChange,
  // onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  index = 0,
}) => {
  const [local, setLocal] = useState<BenefitItem>(item);

  const canEdit = !item.isActive;

  const handleUpdate = (patch: Partial<BenefitItem>) => {
    const updated = { ...local, ...patch };
    setLocal(updated);
    onChange?.(item.id, patch);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={(e) => onDrop?.(e, index)}
      className={`flex items-center gap-3 py-2 px-2 rounded-md transition-all ${
        item.isActive
          ? "cursor-not-allowed bg-gray-100"
          : "cursor-move hover:bg-gray-50"
      }`}
    >
      {/* Title input */}
      <div className="w-3/12">
        <input
          value={local.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Nama jalur / prestasi"
          disabled={!canEdit}
          className={`w-full h-10 px-3 py-2 border border-gray-300 rounded ${
            !local.isActive ? "text-gray-700" : "text-gray-400 bg-gray-50"
          } ${canEdit ? "cursor-text hover:border-primary" : "cursor-not-allowed opacity-60"} disabled:cursor-not-allowed`}
        />
      </div>

      {/* Benefit description */}
      <div className="flex-1">
        <input
          value={local.benefit}
          onChange={(e) => handleUpdate({ benefit: e.target.value })}
          placeholder="Masukkan benefit"
          disabled={!canEdit}
          className={`w-full h-10 px-3 py-2 border border-gray-300 rounded ${
            !local.isActive ? "text-gray-700" : "text-gray-400 bg-gray-50"
          } ${canEdit ? "cursor-text hover:border-primary" : "cursor-not-allowed opacity-60"} disabled:cursor-not-allowed`}
        />
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-4 w-36 justify-end">
        <div className="text-black text-sm">
          {local.isActive ? "Aktif" : "Tidak Aktif"}
        </div>
        <button
          onClick={() => handleUpdate({ isActive: !local.isActive })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            local.isActive ? "bg-primary" : "bg-gray-300"
          }`}
          aria-label={`Toggle aktif ${item.id}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              local.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

interface BenefitListProps {
  title: string;
  items: BenefitItem[];
  onChange: (items: BenefitItem[]) => void;
}

export const BenefitList: React.FC<BenefitListProps> = ({
  title,
  items,
  onChange,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleItemChange = (id: string, patch: Partial<BenefitItem>) => {
    const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    onChange(next);
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    // Update order values
    const reorderedItems = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    onChange(reorderedItems);
    setDraggedIndex(null);
  };

  return (
    <div className="p-4 space-y-2 w-full">
      {title && (
        <div className="text-base text-gray-500 mb-2 font-semibold">
          {title}
        </div>
      )}

      <div className="flex items-center gap-3 py-2 px-2 bg-gray-50 rounded-md">
        <div className="w-3/12 text-gray-600 font-medium">Jalur / Nama</div>
        <div className="flex-1 text-gray-600 font-medium">Benefit</div>
        <div className="w-36 text-gray-600 font-medium text-right">Status</div>
      </div>

      <div className="space-y-1">
        {items.map((it, index) => (
          <BenefitCard
            key={it.id}
            item={it}
            index={index}
            onChange={handleItemChange}
            onDelete={handleDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};
