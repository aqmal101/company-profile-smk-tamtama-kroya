"use client";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useRef, useState } from "react";
import { TooltipArrow } from "@radix-ui/react-tooltip";

type TruncatedTooltipTextProps = {
  text: string;
  placeholder?: string;
  textClassName?: string;
  tooltipContentClassName?: string;
};

export default function TruncatedTooltipText({
  text,
  placeholder = "-",
  textClassName,
  tooltipContentClassName,
}: TruncatedTooltipTextProps) {
  const normalizedText = text.trim() ? text : placeholder;
  const isPlaceholder = normalizedText === placeholder;
  const [isOverflowing, setIsOverflowing] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  const textRefCallback = useCallback(
    (element: HTMLParagraphElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!element || isPlaceholder) {
        setIsOverflowing(false);
        return;
      }

      const checkOverflow = () => {
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      };

      checkOverflow();

      observerRef.current = new ResizeObserver(checkOverflow);
      observerRef.current.observe(element);
    },
    [isPlaceholder],
  );

  useEffect(() => {
    if (isPlaceholder) return;

    const onFontsReady = () => {
      const el = document.querySelector(
        "[data-truncated-tooltip]",
      ) as HTMLElement | null;
      if (el) {
        setIsOverflowing(el.scrollWidth > el.clientWidth);
      }
    };

    document.fonts?.ready.then(onFontsReady);
  }, [normalizedText, isPlaceholder]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <p
          ref={textRefCallback}
          data-truncated-tooltip
          className={cn(
            "mt-0.5 truncate text-gray-600",
            textClassName,
            isOverflowing ? "cursor-help" : undefined,
          )}
        >
          {normalizedText}
        </p>
      </TooltipTrigger>
      {isOverflowing && (
        <TooltipContent
          side="bottom"
          align="center"
          className={cn(
            "max-w-xs border bg-white text-sm font-normal text-black shadow-md sm:max-w-sm [&>svg]:border-gray-200 [&>svg]:fill-white",
            tooltipContentClassName,
          )}
        >
          <p className="whitespace-normal wrap-break-word">{normalizedText}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
