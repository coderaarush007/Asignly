"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";

export interface SelectOption {
  value: string;
  label: string;
  swatch?: string;
  description?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  triggerClassName?: string;
}

const triggerClasses =
  "flex w-full items-center justify-between gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 text-left text-sm text-text outline-none transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] disabled:opacity-50 disabled:pointer-events-none hover:bg-surface-hover";

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  id,
  disabled,
  className,
  "aria-label": ariaLabel,
  triggerClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const typeaheadRef = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLLIElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function openList() {
    if (disabled) return;
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function selectOption(opt: SelectOption) {
    onChange(opt.value);
    closeList();
    buttonRef.current?.focus();
  }

  function handleTypeahead(key: string) {
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
    typeaheadRef.current += key.toLowerCase();
    const match = options.findIndex((o) => o.label.toLowerCase().startsWith(typeaheadRef.current));
    if (match >= 0) setActiveIndex(match);
    typeaheadTimer.current = setTimeout(() => {
      typeaheadRef.current = "";
    }, 500);
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        openList();
        return;
      }
    }
    if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
      if (!open) openList();
      handleTypeahead(event.key);
    }
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) selectOption(options[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        closeList();
        buttonRef.current?.focus();
        break;
      case "Tab":
        closeList();
        break;
      default:
        if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) handleTypeahead(event.key);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-controls={listId}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(triggerClasses, triggerClassName)}
      >
        <span className={cn("flex min-w-0 items-center gap-2 truncate", !selected && "text-text-muted")}>
          {selected?.swatch && (
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: selected.swatch }} />
          )}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <Popover open={open} anchorRef={buttonRef} onClose={closeList} matchWidth className="p-1.5">
        <ul
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={handleListKeyDown}
          ref={listRef}
          className="max-h-64 space-y-0.5 overflow-auto outline-none"
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-text-muted">No options</li>
          )}
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                data-index={index}
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(opt)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                  isActive ? "bg-primary-tint text-primary" : "text-text hover:bg-surface-hover",
                )}
              >
                {opt.swatch && (
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: opt.swatch }} />
                )}
                <span className="min-w-0 flex-1 truncate">
                  <span className="block truncate font-medium">{opt.label}</span>
                  {opt.description && (
                    <span className="block truncate text-xs text-text-secondary">{opt.description}</span>
                  )}
                </span>
                {isSelected && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}
