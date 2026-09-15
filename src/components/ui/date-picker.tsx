"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";
import { buildMonthGrid, isSameMonth } from "@/lib/calendar";

interface DatePickerProps {
  /** yyyy-MM-dd, or "" for no date */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function DatePicker({ value, onChange, id, disabled, className, "aria-label": ariaLabel }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectedDate = useMemo(() => parseDateInput(value), [value]);

  function pick(date: Date) {
    onChange(formatDateInput(date));
    setOpen(false);
    buttonRef.current?.focus();
  }

  const label = selectedDate
    ? selectedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "Select date";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 text-left text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] disabled:opacity-50 hover:bg-surface-hover",
          !selectedDate && "text-text-muted",
          className,
        )}
      >
        <span className="truncate">{label}</span>
        <CalendarDays className="size-4 shrink-0 text-text-muted" aria-hidden />
      </button>

      <Popover open={open} anchorRef={buttonRef} onClose={() => setOpen(false)} className="w-72 p-3">
        {open && (
          <CalendarBody
            selectedDate={selectedDate}
            value={value}
            onPick={pick}
            onClear={() => {
              onChange("");
              setOpen(false);
            }}
          />
        )}
      </Popover>
    </>
  );
}

function CalendarBody({
  selectedDate,
  value,
  onPick,
  onClear,
}: {
  selectedDate: Date | null;
  value: string;
  onPick: (date: Date) => void;
  onClear: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => selectedDate ?? today);
  const [focusDate, setFocusDate] = useState(() => selectedDate ?? today);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gridRef.current?.focus();
  }, []);

  const grid = useMemo(() => buildMonthGrid(cursor), [cursor]);

  function moveFocus(days: number) {
    const next = new Date(focusDate);
    next.setDate(next.getDate() + days);
    setFocusDate(next);
    if (!isSameMonth(next, cursor)) setCursor(next);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveFocus(1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(7);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(-7);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onPick(focusDate);
        break;
    }
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="flex size-7 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <span className="text-sm font-bold text-text">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="flex size-7 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-hover"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>

      <div ref={gridRef} role="grid" tabIndex={0} aria-label="Choose a date" onKeyDown={handleKeyDown} className="outline-none">
        <div className="grid grid-cols-7 text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {grid.map((date) => {
            const inMonth = isSameMonth(date, cursor);
            const isToday = isSameDate(date, today);
            const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
            const isFocused = isSameDate(date, focusDate);
            return (
              <button
                key={date.toISOString()}
                type="button"
                role="gridcell"
                tabIndex={-1}
                aria-selected={isSelected}
                onClick={() => onPick(date)}
                onMouseEnter={() => setFocusDate(date)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  !inMonth && "text-text-muted opacity-50",
                  inMonth && !isSelected && "text-text hover:bg-surface-hover",
                  isSelected && "bg-primary text-white",
                  !isSelected && isToday && "font-bold text-primary",
                  !isSelected && isFocused && "ring-2 ring-primary ring-offset-1 ring-offset-surface",
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <button
          type="button"
          onClick={() => onPick(today)}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-tint"
        >
          Today
        </button>
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-text-secondary hover:bg-surface-hover"
          >
            <X className="size-3" aria-hidden />
            Clear
          </button>
        )}
      </div>
    </>
  );
}
