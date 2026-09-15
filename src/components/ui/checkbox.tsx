import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <span className={cn("relative inline-flex size-[18px] shrink-0", className)}>
    <input
      ref={ref}
      type="checkbox"
      className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-[6px] border-[1.5px] border-border-strong bg-surface transition-colors checked:border-success checked:bg-success disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
    <Check
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full scale-75 p-[2px] text-white opacity-0 transition-opacity peer-checked:opacity-100"
      strokeWidth={3}
    />
  </span>
));
Checkbox.displayName = "Checkbox";
