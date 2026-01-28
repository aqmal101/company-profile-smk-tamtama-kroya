import { ReactNode } from "react";
import { IoChevronDown } from "react-icons/io5";

export interface DropdownProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  label: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  width?: string; // e.g., "w-full", "w-[60%]", "w-32"
  color?: string; // e.g., "bg-primary", "bg-green-500", "bg-[#25d366]"
  textColor?: string; // e.g., "text-white", "text-gray-900"
  rounded?: string; // e.g., "rounded-sm", "rounded-md", "rounded-full"
  children: ReactNode; // Dropdown menu items
  borderColor?: string; // e.g., "border-primary", "border-gray-300"
  className?: string; // Additional custom classes
  hideChevron?: boolean; // Hide the chevron icon
}

export default function Dropdown({
  isOpen,
  onOpen,
  onClose,
  label,
  leftIcon,
  rightIcon,
  width = "w-full",
  color = "bg-primary",
  textColor = "text-white",
  //   textAlign = "text-left",
  rounded = "rounded-sm",
  children,
  borderColor = "border-primary",
  className = "px-6 py-2",
  hideChevron = false,
}: DropdownProps) {
  return (
    <div className={`h-full relative z-11 ${width}`}>
      <button
        className={`h-full w-full border-2 ${isOpen ? `${borderColor}` : borderColor} flex flex-row ${rounded} ${color} justify-between items-center space-x-4 max-md:px-1 max-md:py-1 max-md:text-sm ${textColor} group transition-transform duration-200 ease-in-out cursor-pointer ${className}`}
        onClick={onOpen}
      >
        <div className="flex items-center space-x-2">
          {leftIcon && <div className="shrink-0">{leftIcon}</div>}
        </div>
        <p className="max-sm:text-xs">{label}</p>
        <div className="flex items-center space-x-2">
          {rightIcon && <div className="shrink-0">{rightIcon}</div>}
          {!hideChevron && (
            <IoChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isOpen ? "-rotate-90" : ""
              }`}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={onClose}
          style={{ background: "transparent" }}
        />
      )}

      {isOpen && (
        <div
          className="absolute mt-2 w-full z-20 flex items-start justify-start"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="w-full p-2 rounded-lg bg-white border border-gray-300 shadow-lg">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
