"use client";

import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/hooks/use-is-client";

interface PopoverProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: React.ReactNode;
  align?: "start" | "end";
  matchWidth?: boolean;
  className?: string;
}

/**
 * Portals its content to document.body and positions it with `position: fixed`
 * against the anchor's bounding rect. This guarantees the popover is never
 * clipped by an ancestor with overflow:hidden (dialogs, cards, scroll areas).
 */
export function Popover({
  open,
  anchorRef,
  onClose,
  children,
  align = "start",
  matchWidth,
  className,
}: PopoverProps) {
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  const panelRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();

  useLayoutEffect(() => {
    if (!open) return;

    function reposition() {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const panelHeight = panel?.offsetHeight ?? 320;
      const gap = 6;
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const spaceBelow = viewportH - rect.bottom;
      const openUp = spaceBelow < panelHeight + gap && rect.top > spaceBelow;

      const next: React.CSSProperties = {
        position: "fixed",
        top: openUp ? undefined : Math.min(rect.bottom + gap, viewportH - gap),
        bottom: openUp ? Math.max(viewportH - rect.top + gap, gap) : undefined,
        maxHeight: openUp ? rect.top - gap * 2 : viewportH - rect.bottom - gap * 2,
        width: matchWidth ? rect.width : undefined,
        minWidth: matchWidth ? undefined : rect.width,
        visibility: "visible",
      };

      if (align === "end") {
        next.right = Math.max(viewportW - rect.right, 8);
      } else {
        next.left = Math.max(Math.min(rect.left, viewportW - (matchWidth ? rect.width : 240) - 8), 8);
      }

      setStyle(next);
    }

    reposition();
    const raf = requestAnimationFrame(reposition);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, anchorRef, align, matchWidth]);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !isClient) return null;

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      className={cn(
        "z-50 overflow-auto rounded-xl border border-border bg-surface text-sm text-text shadow-overlay",
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
}
