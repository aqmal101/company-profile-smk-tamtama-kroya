"use client";

import { useCallback, useEffect, useState } from "react";

export function useLeavePageConfirm(
  storageKey: string,
  storageTabKey?: string,
  options?: { canPrompt?: () => boolean },
) {
  const [leaveConfirmation, setLeaveConfirmation] = useState<{
    isOpen: boolean;
    href?: string | null;
  }>({ isOpen: false, href: null });

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      if (storageTabKey) localStorage.removeItem(storageTabKey);
    } catch {
      // ignore
    }
  }, [storageKey, storageTabKey]);

  useEffect(() => {
    const shouldPrompt = () => {
      if (typeof options?.canPrompt === "function") {
        try {
          return options!.canPrompt!();
        } catch {
          return Boolean(localStorage.getItem(storageKey));
        }
      }
      return Boolean(localStorage.getItem(storageKey));
    };

    const handler = (e: MouseEvent) => {
      const element = e.target as Element | null;
      const anchor = element?.closest ? element.closest("a") : null;
      if (!anchor) return;
      const href = (anchor as HTMLAnchorElement).getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      const url = new URL(href, window.location.href);
      if (url.pathname.startsWith("/pendaftaran")) return;

      if (shouldPrompt()) {
        e.preventDefault();
        setLeaveConfirmation({ isOpen: true, href: url.href });
      }
    };

    // Use capture phase so it runs before other click handlers (e.g., Next.js Link)
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [storageKey, options]);

  useEffect(() => {
    const shouldPrompt = () => {
      if (typeof options?.canPrompt === "function") {
        try {
          return options!.canPrompt!();
        } catch {
          return Boolean(localStorage.getItem(storageKey));
        }
      }
      return Boolean(localStorage.getItem(storageKey));
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldPrompt()) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    // NOTE: We intentionally avoid clearing saved data automatically on 'unload'
    // because that could delete the user's draft before they explicitly confirm.
    // Clearing now happens only when the user confirms via the on-page dialog
    // (confirmLeave(true) calls clearSavedData()).
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [storageKey, storageTabKey, options, clearSavedData]);

  const confirmLeave = useCallback(
    (proceed: boolean) => {
      const href = leaveConfirmation.href;
      setLeaveConfirmation({ isOpen: false, href: null });
      if (proceed) {
        clearSavedData();
        if (href) {
          window.location.href = href;
        } else {
          window.history.back();
        }
      }
    },
    [leaveConfirmation, clearSavedData],
  );

  return {
    leaveConfirmation,
    setLeaveConfirmation,
    confirmLeave,
    clearSavedData,
  };
}
