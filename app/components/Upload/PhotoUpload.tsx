"use client";

import React from "react";
import DragDropFile from "@/components/Upload/DragDropFile";

export interface PhotoUploadProps {
  previewUrl: string;
  onFileSelect: (file: File | null) => void;
  onFileRemove: () => void;
  disabled?: boolean;
  label?: string;
  isMandatory?: boolean;
  error?: string;
  textButton?: string;
  className?: string;
  maxSizeInMB?: number;
  onValidationError?: (message: string) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  previewUrl,
  onFileSelect,
  onFileRemove,
  disabled = false,
  label = "Foto Profil",
  isMandatory = false,
  error,
  textButton = "Ganti Foto",
  className = "",
  maxSizeInMB = 5,
  onValidationError,
}) => {
  const maxSizeBytes = maxSizeInMB * 1024 * 1024;

  return (
    <div className={`form-item ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {isMandatory && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="space-y-4">
        {/* Drag Drop File */}
        <DragDropFile
          accept="image/*"
          multiple={false}
          disabled={disabled}
          textButton={textButton}
          onFile={(file) => onFileSelect(file || null)}
          previewUrl={previewUrl || undefined}
          showPreview={true}
          onRemove={onFileRemove}
          onValidate={(file) => {
            if (file.size > maxSizeBytes) {
              const message = `Ukuran file maksimal ${maxSizeInMB}MB`;
              onValidationError?.(message);
              return message;
            }
            // Validate file type
            if (!file.type.startsWith("image/")) {
              const message = "File harus berupa gambar";
              onValidationError?.(message);
              return message;
            }
            return null;
          }}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          Format: JPG, PNG, GIF. Ukuran maksimal: {maxSizeInMB}MB
        </p>
      </div>
    </div>
  );
};

export default PhotoUpload;
