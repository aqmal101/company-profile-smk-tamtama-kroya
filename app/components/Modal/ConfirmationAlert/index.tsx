"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import { BaseModal } from "@/components/Modal/BaseModal";
import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmationAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger",
}) => {
  const iconColor = variant === "danger" ? "text-red-500" : "text-amber-500";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      showCloseButton={true}
      size="md"
    >
      <div className="flex h-full flex-col items-center text-center justify-between">
        <LuTriangleAlert className={`${iconColor} text-5xl`} />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="w-full flex gap-3 pt-12 justify-end">
          <TextButton
            variant="outline"
            text={cancelText}
            className="w-full"
            onClick={onCancel}
          />
          <TextButton
            variant="danger"
            text={confirmText}
            className="w-full"
            onClick={onConfirm}
          />
        </div>
      </div>
    </BaseModal>
  );
};
