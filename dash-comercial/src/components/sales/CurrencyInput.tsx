"use client";

import { forwardRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { fmtBRL, parseBRL } from "@/lib/utils/currency";

interface CurrencyInputProps {
  value: number;
  onChange: (n: number) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

function rawForEdit(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "";
  return n.toFixed(2).replace(".", ",");
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput(
    { value, onChange, placeholder, id, disabled, ...aria },
    ref
  ) {
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState(() => rawForEdit(value));

    const display = focused ? draft : value > 0 ? fmtBRL(value) : "";

    return (
      <Input
        ref={ref}
        id={id}
        inputMode="decimal"
        placeholder={placeholder ?? "R$ 0,00"}
        value={display}
        disabled={disabled}
        aria-invalid={aria["aria-invalid"]}
        onFocus={() => {
          setDraft(rawForEdit(value));
          setFocused(true);
        }}
        onChange={(e) => {
          const next = e.target.value;
          setDraft(next);
          const parsed = parseBRL(next);
          onChange(parsed < 0 ? 0 : parsed);
        }}
        onBlur={() => {
          setFocused(false);
          const clean = parseBRL(draft);
          onChange(clean < 0 ? 0 : clean);
        }}
      />
    );
  }
);
