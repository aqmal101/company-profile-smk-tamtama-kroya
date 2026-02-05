"use client";

import { LuTrash2, LuPlus } from "react-icons/lu";
import React, { useState } from "react";
import { TextButton } from "@/components/Buttons/TextButton";

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
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  item,
  isEditable = true,
  onChange,
  onDelete,
}) => {
  const [local, setLocal] = useState<BenefitItem>(item);

  const handleUpdate = (patch: Partial<BenefitItem>) => {
    const updated = { ...local, ...patch };
    setLocal(updated);
    onChange?.(item.id, patch);
  };

  return (
    <div className="flex items-center gap-3 py-2 px-2 hover:bg-gray-50 transition-colors rounded-md">
      {/* Title input */}
      <div className="w-3/12">
        <input
          value={local.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Nama jalur / prestasi"
          className={`w-full h-10 px-3 py-2 border border-gray-300 rounded ${
            !local.isActive ? "text-gray-400" : "text-gray-700"
          } ${isEditable ? "cursor-text hover:border-primary" : ""}`}
        />
      </div>

      {/* Benefit description */}
      <div className="flex-1">
        <input
          value={local.benefit}
          onChange={(e) => handleUpdate({ benefit: e.target.value })}
          placeholder="Masukkan benefit"
          className={`w-full h-10 px-3 py-2 border border-gray-300 rounded ${
            !local.isActive ? "text-gray-400" : "text-gray-700"
          } ${isEditable ? "cursor-text hover:border-primary" : ""}`}
        />
      </div>

      {/* Order / sort input */}
      <div className="w-20 flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={local.order}
          onChange={(e) => handleUpdate({ order: Number(e.target.value || 0) })}
          className="w-full h-10 px-2 py-1 border border-gray-300 rounded text-center"
        />
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2 w-36 justify-end">
        <div className="text-sm text-gray-500">
          {local.isActive ? "Aktif" : "Non-aktif"}
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

        {/* Delete */}
        <button
          onClick={() => onDelete?.(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
          aria-label="Delete benefit"
        >
          <LuTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

interface BenefitListProps {
  title: string;
  items: BenefitItem[];
  onChange: (items: BenefitItem[]) => void;
  addLabel?: string;
}

export const BenefitList: React.FC<BenefitListProps> = ({
  title,
  items,
  onChange,
  addLabel = "Tambah Prestasi",
}) => {
  const handleItemChange = (id: string, patch: Partial<BenefitItem>) => {
    const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
    onChange(next);
  };

  const handleAdd = () => {
    const newItem: BenefitItem = {
      id: Date.now().toString(),
      title: "",
      benefit: "",
      order: items.length + 1,
      isActive: true,
    };
    onChange([...items, newItem]);
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4 space-y-2 w-full">
      {title && (
        <div className="text-sm text-gray-500 mb-1 font-semibold">{title}</div>
      )}

      <div className="flex items-center gap-3 py-2 px-2 bg-gray-50 rounded-md">
        <div className="w-3/12 text-gray-600 font-medium">Jalur / Nama</div>
        <div className="flex-1 text-gray-600 font-medium">Benefit</div>
        <div className="w-20 text-gray-600 font-medium">Urutan</div>
        <div className="w-36 text-gray-600 font-medium text-right">Status</div>
      </div>

      <div className="space-y-1">
        {items.map((it) => (
          <BenefitCard
            key={it.id}
            item={it}
            onChange={handleItemChange}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div>
        <TextButton
          icon={<LuPlus size={16} />}
          variant="primary"
          text={addLabel}
          onClick={handleAdd}
        />
      </div>
    </div>
  );
};
