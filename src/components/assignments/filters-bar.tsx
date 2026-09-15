"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import type { Subject } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

const PRIORITY_FILTER_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High", swatch: "var(--color-danger)" },
  { value: "medium", label: "Medium", swatch: "var(--color-warning)" },
  { value: "low", label: "Low", swatch: "var(--color-text-muted)" },
];

export function FiltersBar({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subjectOptions = [{ value: "", label: "All Subjects" }, ...subjects.map((s) => ({ value: s.id, label: s.name, swatch: s.color }))];

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("q", search), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assignments..."
          className="pl-9"
          aria-label="Search assignments"
        />
      </div>
      <Select
        value={searchParams.get("subject") ?? ""}
        onChange={(value) => updateParam("subject", value)}
        options={subjectOptions}
        className="sm:w-44"
        aria-label="Filter by subject"
      />
      <Select
        value={searchParams.get("priority") ?? ""}
        onChange={(value) => updateParam("priority", value)}
        options={PRIORITY_FILTER_OPTIONS}
        className="sm:w-40"
        aria-label="Filter by priority"
      />
    </div>
  );
}
