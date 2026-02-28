import { LuEye, LuEyeClosed, LuEyeOff } from "react-icons/lu";

export default function Toggle({
  enabled,
  onChange,
  disabled = false,
  size = "sm",
  showIcon = false,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}) {
  let sizeClasses = "";
  let thumbSizeClasses = "";
  let slideDistanceClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "h-6 w-12";
      thumbSizeClasses = "h-4 w-4";
      slideDistanceClasses = "translate-x-7";
      break;
    case "md":
      sizeClasses = "h-8 w-16";
      thumbSizeClasses = "h-6 w-6";
      slideDistanceClasses = "translate-x-9";
      break;
    case "lg":
      sizeClasses = "h-10 w-20";
      thumbSizeClasses = "h-8 w-8";
      slideDistanceClasses = "translate-x-12";
      break;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex ${sizeClasses} shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? "bg-primary" : "bg-gray-300"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block ${thumbSizeClasses} transform rounded-full bg-white transition-transform ${
          enabled ? slideDistanceClasses : "translate-x-1"
        }`}
      >
        {showIcon && (
          <span className="absolute inset-1 flex items-center text-md justify-center">
            {enabled ? <LuEye /> : <LuEyeOff />}
          </span>
        )}{" "}
      </span>
    </button>
  );
}
