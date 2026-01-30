import React from "react";

export const TextButton: React.FC<{
  text?: string;
  ref?: React.Ref<HTMLButtonElement>;
  variant:
    | "primary"
    | "accent"
    | "secondary"
    | "light"
    | "outline"
    | "outline-danger"
    | "danger"
    | "ghost";
  className?: string;
  onClick?: () => void;
  width?: "full" | "half" | "fit";
  icon?: React.ReactNode;
  isSubmit?: boolean;
  disabled?: boolean;
  hoverEffect?: boolean;
}> = ({
  text,
  variant,
  className,
  onClick,
  width,
  icon,
  isSubmit,
  disabled,
  hoverEffect = false,
}) => {
  let defaultStyle = "";
  switch (variant) {
    case "primary":
      defaultStyle = "bg-primary text-white border hover:opacity-90";
      break;
    case "danger":
      defaultStyle = "bg-red-600 text-white border hover:opacity-90";
      break;
    case "accent":
      defaultStyle = "bg-[#f5a623] text-primary border hover:opacity-90";
      break;
    case "light":
      defaultStyle = "bg-primary-light text-primary border hover:opacity-90";
      break;
    case "secondary":
      defaultStyle =
        "border bg-green-500/20 border-green-300/20 hover:bg-green-500/30 hover:border-green-300";
      break;
    case "outline":
      defaultStyle = "border bg-white border-gray-300 hover:bg-gray-50";
      break;
    case "outline-danger":
      defaultStyle =
        "border bg-white text-red-500 border-red-500 hover:bg-red-50";
      break;
    case "ghost":
      defaultStyle = "border bg-transparent text-white border-white";
      break;
  }
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled}
      className={`${width === "full" ? "w-full" : width === "half" ? "w-1/2" : width === "fit" ? "w-fit" : ""} ${defaultStyle} ${className ?? ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} flex flex-row items-center max-sm:text-xs justify-center gap-2 ${hoverEffect ? "hover:scale-105 transition-transform duration-200 ease-in-out" : ""} h-fit py-2 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-sm font-medium`}
    >
      {icon}
      {text}
    </button>
  );
};
