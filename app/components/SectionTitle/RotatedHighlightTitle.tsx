import { cn } from "@/lib/utils";

interface RotatedHighlightTitleProps {
  title: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  className?: string;
  titleClassName?: string;
  highlightClassName?: string;
}

export default function RotatedHighlightTitle({
  title,
  as = "h2",
  className,
  titleClassName,
  highlightClassName,
}: RotatedHighlightTitleProps) {
  const TitleTag = as;

  return (
    <TitleTag className={cn("relative inline-block w-fit", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 z-0 h-12 w-full -translate-y-1/2 rotate-6 bg-[#C3E2C7]",
          highlightClassName,
        )}
      />
      <span
        className={cn(
          "relative z-10 text-2xl max-sm:text-xl font-semibold text-primary",
          titleClassName,
        )}
      >
        {title}
      </span>
    </TitleTag>
  );
}
