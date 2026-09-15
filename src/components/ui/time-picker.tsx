"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";

interface TimePickerProps {
  /** 24-hour "HH:mm", or "" for no time */
  value: string;
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const HOURS12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,..,55
const MERIDIEMS = ["AM", "PM"] as const;

function parseTimeInput(value: string): { hour12: number; minute: number; meridiem: "AM" | "PM" } | null {
  if (!value) return null;
  const [hStr, mStr] = value.split(":");
  const h24 = Number(hStr);
  const minute = Number(mStr);
  if (Number.isNaN(h24) || Number.isNaN(minute)) return null;
  const meridiem = h24 >= 12 ? "PM" : "AM";
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hour12, minute, meridiem };
}

function toTimeValue(hour12: number, minute: number, meridiem: "AM" | "PM"): string {
  let h24 = hour12 % 12;
  if (meridiem === "PM") h24 += 12;
  return `${String(h24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function Column<T extends number | string>({
  items,
  selected,
  onSelect,
  format,
  label,
}: {
  items: readonly T[];
  selected: T;
  onSelect: (v: T) => void;
  format: (v: T) => string;
  label: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLButtonElement>(`[data-value="${String(selected)}"]`);
    el?.scrollIntoView({ block: "center" });
    // Only scroll into view on mount (when the popover opens) — not on every click, so the list doesn't jump under the pointer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={listRef} role="listbox" aria-label={label} className="h-40 flex-1 space-y-0.5 overflow-y-auto px-0.5">
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <button
            key={String(item)}
            type="button"
            role="option"
            aria-selected={isSelected}
            data-value={item}
            onClick={() => onSelect(item)}
            className={cn(
              "block w-full rounded-lg px-2 py-1.5 text-center text-sm font-semibold tabular-nums transition-colors",
              isSelected ? "bg-primary text-white" : "text-text hover:bg-surface-hover",
            )}
          >
            {format(item)}
          </button>
        );
      })}
    </div>
  );
}

export function TimePicker({ value, onChange, id, disabled, className, "aria-label": ariaLabel }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const parsed = useMemo(() => parseTimeInput(value), [value]);

  const label = parsed
    ? `${parsed.hour12}:${String(parsed.minute).padStart(2, "0")} ${parsed.meridiem}`
    : "Select time";

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
          !parsed && "text-text-muted",
          className,
        )}
      >
        <span className="truncate">{label}</span>
        <Clock className="size-4 shrink-0 text-text-muted" aria-hidden />
      </button>

      <Popover open={open} anchorRef={buttonRef} onClose={() => setOpen(false)} className="w-56 p-3">
        {open && (
          <TimePickerBody
            value={value}
            onChange={onChange}
            onDone={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          />
        )}
      </Popover>
    </>
  );
}

function TimePickerBody({
  value,
  onChange,
  onDone,
}: {
  value: string;
  onChange: (value: string) => void;
  onDone: () => void;
}) {
  const parsed = parseTimeInput(value);
  const [hour12, setHour12] = useState(parsed?.hour12 ?? 11);
  const [minute, setMinute] = useState(parsed?.minute ?? 59);
  const [meridiem, setMeridiem] = useState<"AM" | "PM">(parsed?.meridiem ?? "PM");

  function commit(next: Partial<{ hour12: number; minute: number; meridiem: "AM" | "PM" }>) {
    const h = next.hour12 ?? hour12;
    const m = next.minute ?? minute;
    const mer = next.meridiem ?? meridiem;
    setHour12(h);
    setMinute(m);
    setMeridiem(mer);
    onChange(toTimeValue(h, m, mer));
  }

  return (
    <>
      <div className="flex gap-1">
        <Column items={HOURS12} selected={hour12} onSelect={(h) => commit({ hour12: h })} format={(h) => String(h)} label="Hour" />
        <Column
          items={MINUTES}
          selected={minute}
          onSelect={(m) => commit({ minute: m })}
          format={(m) => String(m).padStart(2, "0")}
          label="Minute"
        />
        <Column items={MERIDIEMS} selected={meridiem} onSelect={(m) => commit({ meridiem: m })} format={(m) => m} label="AM or PM" />
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            const h24 = now.getHours();
            const m = Math.round(now.getMinutes() / 5) * 5;
            const meridiemNow = h24 >= 12 ? "PM" : "AM";
            const hour12Now = h24 % 12 === 0 ? 12 : h24 % 12;
            commit({ hour12: hour12Now, minute: m % 60, meridiem: meridiemNow });
          }}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-tint"
        >
          Now
        </button>
        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                onDone();
              }}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-text-secondary hover:bg-surface-hover"
            >
              <X className="size-3" aria-hidden />
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-text hover:bg-surface-hover"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
